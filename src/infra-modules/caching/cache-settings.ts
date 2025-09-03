

export class CacheSettings {
    store: string | "memory" | "redis";
    ttl: number;
    max: number;
    
    /**
     * `redis[s]://[[username][:password]@][host][:port][/db-number]`
     * See [`redis`](https://www.iana.org/assignments/uri-schemes/prov/redis) and [`rediss`](https://www.iana.org/assignments/uri-schemes/prov/rediss) IANA registration for more details
     */
    redisUrl?: string;
}