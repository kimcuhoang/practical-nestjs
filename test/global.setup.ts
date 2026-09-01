/// <reference path="./e2e.d.ts" />

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

    globalThis.redisContainer = await new RedisContainer("redis:alpine")
                        .withNetworkAliases("practical-nestjs-network")
                        .withStartupTimeout(50000)
                        .start();
};

