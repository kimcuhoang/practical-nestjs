# Cache and Redis Implementation

This document describes the Redis-backed caching work on the `feat/redis-and-cache` branch compared with `main`.

## Overview

The branch replaces the previous `infra-modules/caching` integration with a dedicated, global `HraCacheModule`. The new implementation uses `ioredis` directly and exposes two application services:

- `HraCacheService` provides cache operations and JSON serialization.
- `HraRedisService` owns the Redis client lifecycle and stores cache profiles registered by application services.

The first application feature using the cache is the `GET /biz-units/:id` endpoint. A successful first lookup reads from the database through the CQRS query bus and stores the result in Redis. Later lookups for the same ID are served from Redis until the entry expires.

## Module Relationship

The diagram below reflects the module composition and override points implemented on this branch. `-->` shows an import or runtime dependency. `- - >` shows a provider supplied as an extension or override configuration.

```
AppModule
  |--> ConfigModule / ConfigService
  |--> HraCacheModule.forRoot
  |      |--> YAN_CACHE_MODULE_OPTIONS (CacheOptions)
  |      |      |--> REDIS_CLIENT (shared ioredis client)
  |      |             |--> REDIS_SERVICE (HraRedisService)
  |      |             `--> YAN_CACHE_SERVICE (HraCacheService)
  |      |--> globally exports the options, client, and services
  |      | - - > overrideYanRedisService (optional replacement)
  |      ` - - > overrideYanCacheService (optional replacement)
  |
  `--> WhraPlanningModule.forRoot
         |--> BizUnitsModule.forRoot
         |      | - - > additionalProviders: BizUnitsService
         |      | - - > exportProviders: BizUnitsService
         |      `--> w-hra-modules/biz-units
         |             (queries, commands, and persistence)
         |--> other w-hra-modules
         |    (partners, customers, orders, shipments, and lanes)
         ` - - > planning-specific provider overrides
                    (shipment and shipment-lane services)

BizUnitsControllers
  --> BizUnitsService
        |--> YAN_CACHE_SERVICE (global injection)
        |--> REDIS_SERVICE (global injection, profile registry)
        `--> QueryBus --> GetBizUnitQuery --> DatabaseModule / TypeORM
```

### Reading the override relationships

- `AppModule` supplies cache configuration through `HraCacheModule.forRoot`, including the Redis connection string and enabled flag.
- `HraCacheModule` normally binds `REDIS_SERVICE` to `HraRedisService` and `YAN_CACHE_SERVICE` to `HraCacheService`. The `overrideYanRedisService` and `overrideYanCacheService` options can replace those bindings with custom providers.
- `HraCacheModule` is global, which allows `BizUnitsService` to inject `REDIS_SERVICE` and `YAN_CACHE_SERVICE` without importing the cache module directly.
- `WhraPlanningModule` composes the `w-hra-modules` and adds `BizUnitsService` to `BizUnitsModule` through `additionalProviders` and `exportProviders`.
- The planning module also supplies domain-specific overrides to shipment and shipment-lane modules. Those are separate from Redis overriding, but are shown because they are part of the branch's module composition pattern.

## Changes Compared With `main`

### Replaced cache module

`main` used `CachingModule`, Nest's `CacheModule`, and `cache-manager-redis-yet`. Its settings supported a memory or Redis store and configured a shared cache manager.

This branch removes the old `src/infra-modules/caching` module, service, controller, settings, and index. It adds `src/infra-modules/cache` with:

- `HraCacheModule.forRoot(...)` for dynamic, global registration.
- A Redis client provider backed by `ioredis`.
- Symbol-based provider tokens in `cache.symbols.ts`.
- `HraCacheService` for key/value and hash operations.
- `HraRedisService` for Redis shutdown and cache-profile registration.

The `ioredis` dependency is upgraded to version 6 and `@types/ioredis` is added. The previous cache-manager packages remain declared in `package.json`, although the new module does not use them directly.

### Application wiring

`AppModule` registers the cache module as an infrastructure module:

```ts
HraCacheModule.forRoot({
  cacheOptions: {
    useFactory: (configService) => ({
      timeToLiveInMinutes: Number(
        configService.get('YAN_CACHE_TTL_IN_MINUTES', 30),
      ),
      redisConnectionString: configService.get(
        'YAN_REDIS_CONNECTION_STRING',
        'redis://localhost:6379/0',
      ),
      redisEnabled: configService.get('YAN_REDIS_ENABLED', true),
    }),
    inject: [ConfigService],
  },
});
```

`HraCacheModule` is global, so consumers do not need to import it again. Its providers are exported under these tokens:

- `YAN_CACHE_MODULE_OPTIONS`: resolved `CacheOptions`.
- `REDIS_CLIENT`: the shared `ioredis` client.
- `REDIS_SERVICE`: the Redis profile/lifecycle service.
- `YAN_CACHE_SERVICE`: the cache operation service.

The Redis client is created once by Nest's provider container. It logs `connecting`, `connect`, `ready`, and `error` events. `HraRedisService.onModuleDestroy()` calls `quit()` so the shared client closes with the Nest application.

## Cache Service API

`HraCacheService` is the application-facing abstraction. Values are serialized with `JSON.stringify` before writing and parsed with `JSON.parse` when reading.

### Simple keys

- `set(key, value, ttlInMinutes?)`: writes a value with an `EX` TTL.
- `get<T>(key)`: returns the parsed value or `null`.
- `delete(key)`: removes one key.
- `wrap<T>(key, fn, ttlInMinutes?)`: returns a cached value, or calls `fn`, caches its result, and returns it.
- `reset(pattern?)`: deletes all keys matching a Redis glob pattern; the default pattern is `*`.

### Hashes

- `setHash(key, field, value, ttlInMinutes?)`
- `getHash<T>(key, field)`
- `deleteHash(key, field)`
- `wrapHash<T>(key, field, fn, ttlInMinutes?)`
- `resetHash(pattern?)`

Hash TTL is applied to the Redis hash key, so the expiry covers all fields in that hash. `wrap` and `wrapHash` bypass Redis and execute the supplied function when `redisEnabled` is false.

## Cache Profiles

`OperatorCacheProfile` describes one cacheable operation:

- `operator`: operation name, such as `get-by-id`.
- `cacheKeyTemplate`: key template with named placeholders.
- `timeToLiveInMinutes`: operation-specific TTL.

`ObjectCacheProfiles` groups those profiles by domain object. `HraRedisService` keeps these profiles in memory and supports:

- `addObjectCacheProfile(profile)`: replaces an existing profile group for the same object.
- `addOperatorCacheProfile(objectName, profile)`: adds an operator profile to an existing group or creates one.
- `getCacheProfiles(objectName)`: retrieves a group.

The registry currently documents cache policy for consumers; it does not generate keys or perform caching by itself.

## Biz-unit Read Flow

`BizUnitsService` is registered by `WhraPlanningModule` and injects `YAN_CACHE_SERVICE`, `REDIS_SERVICE`, and `QueryBus`.

During application bootstrap it registers this profile:

```text
object:  BizUnit
operator: get-by-id
key:     biz-unit-{bizUnitId}
TTL:     1440 minutes (1 day)
```

The request flow for `GET /biz-units/:id` is:

```text
Client
  |
  | GET /biz-units/{bizUnitId}
  v
BizUnitsControllers.get(id)
  |
  | calls getBizUnitById(bizUnitId)
  v
BizUnitsService
  |
  | resolves profile: BizUnit / get-by-id
  | builds key: biz-unit-{bizUnitId}
  v
HraCacheService.wrap(cacheKey, loadBizUnit, 1440 minutes)
  |
  +--> Redis GET biz-unit-{bizUnitId}
  |       |
  |       +--> Cache hit: JSON value found
  |       |       |
  |       |       `--> parse JSON and return cached BizUnit
  |       |
  |       `--> Cache miss: key not found
  |               |
  |               v
  |        QueryBus.execute(GetBizUnitQuery)
  |               |
  |               v
  |        GetBizUnitQueryHandler
  |               |
  |               v
  |        DatabaseModule / TypeORM
  |               |
  |               `--> BizUnit query result
  |                       |
  |                       v
  |                JSON.stringify(result)
  |                       |
  |                       v
  |                Redis SET biz-unit-{bizUnitId}
  |                EX 86400 seconds (1 day)
  |                       |
  +-----------------------+
                          |
                          v
                  Return BizUnit result
                          |
                          v
                  HTTP 200 response
```

For `getBizUnitById(bizUnitId)`:

1. The service finds the `get-by-id` profile and replaces `{bizUnitId}` in the key template.
2. `HraCacheService.wrap` checks Redis for the generated key.
3. On a cache hit, the stored JSON is returned and the CQRS query is not executed.
4. On a cache miss, `GetBizUnitQuery` is sent through `QueryBus`.
5. The query result is serialized and stored with a one-day TTL.
6. The controller returns the result from either source.

The create flow does not currently invalidate or refresh a cached biz-unit entry. A cached entry can therefore remain stale until its TTL expires if the corresponding biz unit is changed through another flow.

## Configuration

Local configuration in `.env` uses:

```dotenv
YAN_CACHE_TTL_IN_MINUTES=30
YAN_REDIS_CONNECTION_STRING=redis://localhost:6379/0
YAN_REDIS_ENABLED=true
```

The default connection string is `redis://localhost:6379/0`. The cache service treats Redis as enabled when `redisEnabled` is absent, and skips Redis operations when it is strictly false.

### Configuration notes

- The `timeToLiveInMinutes` option is accepted by the module and loaded into `CacheOptions`, but `HraCacheService.set` defaults to 60 minutes when a caller does not pass a TTL. Consumers should pass an explicit TTL when the configured module value is intended to apply.
- Values from environment variables are strings. `YAN_REDIS_ENABLED` should be converted to a boolean before being passed to the module; otherwise an environment value of `"false"` is truthy in JavaScript.
- `reset` and `resetHash` use Redis `KEYS`, which is convenient for development but can block Redis on a large keyspace. A production-scale invalidation path should use a cursor-based scan or more targeted keys.
- `wrap` does not lock concurrent misses. Multiple requests arriving together can execute the underlying function before one result is cached.

## Test Setup

The e2e global setup now always starts both:

- PostgreSQL through `PostgreSqlContainer`.
- Redis through `RedisContainer`.

Before the Nest testing module is compiled, `test/test.setup.ts` sets `YAN_REDIS_CONNECTION_STRING` to the Redis container's mapped connection URL. The global teardown stops and removes both containers.

`test/w-hra-planning/biz-units-controller/get.e2e.ts` verifies the cache behavior:

- The first HTTP request returns the saved biz unit successfully.
- The second request returns the same data while a spy confirms `QueryBus.execute` is not called.

Run the full e2e suite with:

```bash
yarn test:e2e
```

Run the focused cache-consuming endpoint test with:

```bash
yarn test:e2e --runTestsByPath test/w-hra-planning/biz-units-controller/get.e2e.ts
```

Both commands require Docker because the tests provision PostgreSQL and Redis with Testcontainers.
