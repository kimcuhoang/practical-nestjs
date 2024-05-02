import { createClient } from "redis";

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const REDIS_CLIENT_12 = Symbol('REDIS_CLIENT_12');

export type RedisClient = ReturnType<typeof createClient>;