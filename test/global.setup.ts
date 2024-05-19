require("tsconfig-paths/register");
import 'dotenv/config';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';

module.exports = async () => {

    const postgresContainer = await new PostgreSqlContainer("postgres:alpine")
        .withDatabase("practical-nestjs-testing")
        .withUsername("postgres")
        .withPassword("postgres")
        .withNetworkAliases("practical-nestjs-network")
        .withStartupTimeout(50000)
        .start();
    
    globalThis.postgresContainer = postgresContainer;

    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisUrl = process.env.REDIS_URL;

    const redisIsEnabled = (redisHost !== undefined && redisHost !== "" && redisPort !== undefined && redisPort != "") 
        || (redisUrl !== undefined && redisUrl !== "");
        
    globalThis.redisEnabled = redisIsEnabled;

    if (redisIsEnabled) {

        const redisContainer = await new RedisContainer("redis:alpine")
                    .withNetworkAliases("practical-nestjs-network")
                    .withStartupTimeout(50000)
                    .start();

        globalThis.redisContainer = redisContainer;
    }
    
};