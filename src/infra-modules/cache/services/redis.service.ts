import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "../cache.symbols";

@Injectable()
export class HraRedisService implements OnModuleDestroy {
    private readonly logger = new Logger(HraRedisService.name);

    constructor(
        @Inject(REDIS_CLIENT) 
        protected readonly redisClient: Redis,
    ) {}

    public async onModuleDestroy(): Promise<void> {
        await this.redisClient.quit();
    }
}