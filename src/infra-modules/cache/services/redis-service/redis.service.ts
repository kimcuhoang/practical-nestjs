import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "../../cache.symbols";
import { ObjectCacheProfiles, OperatorCacheProfile } from "./models/redis-cache-profile";

@Injectable()
export class HraRedisService implements OnModuleInit, OnModuleDestroy {

    private cacheProfiles: ObjectCacheProfiles[] = [];

    constructor(
        @Inject(REDIS_CLIENT) 
        protected readonly redisClient: Redis,
    ) {}

    public async onModuleInit(): Promise<void> {
        await Promise.resolve();
    }

    public async onModuleDestroy(): Promise<void> {
        await this.redisClient.quit();
    }

    public addObjectCacheProfile(profile: ObjectCacheProfiles): void {
        const existingProfile = this.getCacheProfiles(profile.objectName);
        if (existingProfile) {
            this.cacheProfiles = this.cacheProfiles.filter(p => p.objectName !== profile.objectName);
        }
        this.cacheProfiles.push(profile);
    }

    public addOperatorCacheProfile(objectName: string, profile: OperatorCacheProfile): void {
        const existingProfile = this.getCacheProfiles(objectName);
        if (existingProfile) {
            existingProfile.profiles.push(profile);
        } else {
            this.cacheProfiles.push({
                objectName,
                profiles: [profile]
            });
        }
    }

    public getCacheProfiles(objectName: string): ObjectCacheProfiles|undefined {
        return this.cacheProfiles.find(p => p.objectName === objectName);
    }
}