import 'dotenv/config';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';

module.exports = async () => {

    globalThis.postgresContainer = await new PostgreSqlContainer("postgres:alpine3.20")
                        .withDatabase("practical-nestjs-testing")
                        .withUsername("postgres")
                        .withPassword("postgres")
                        .withNetworkAliases("practical-nestjs-network")
                        .withStartupTimeout(50000)
                        .start();

    const cacheStore = process.env.CACHE_STORE;
    const redisIsEnabled = cacheStore === 'redis';
        
    globalThis.redisEnabled = redisIsEnabled;

    if (redisIsEnabled) {
        globalThis.redisContainer = await new RedisContainer("redis:alpine")
                        .withNetworkAliases("practical-nestjs-network")
                        .withStartupTimeout(50000)
                        .start();
    }
};

