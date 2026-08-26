import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { REDIS_SERVICE, YAN_CACHE_SERVICE } from "@src/infra-modules/cache/cache.symbols";
import { HraCacheService } from "@src/infra-modules/cache/services/cache-service/cache.service";
import { ObjectCacheProfiles } from "@src/infra-modules/cache/services/redis-service/models/redis-cache-profile";
import { HraRedisService } from "@src/infra-modules/cache/services/redis-service/redis.service";
import { BizUnit } from "@src/w-hra-modules/biz-units/domain";
import { GetBizUnitQuery, GetBizUnitQueryResult } from "@src/w-hra-modules/biz-units/use-cases/queries";

@Injectable()
export class BizUnitsService implements OnApplicationBootstrap {

    private readonly cacheProfile: ObjectCacheProfiles = {
        objectName: BizUnit.name,
        profiles: []
    };

    private readonly getById: string = "get-by-id";

    constructor(
        @Inject(YAN_CACHE_SERVICE)
        private readonly yanCacheService: HraCacheService,
        @Inject(REDIS_SERVICE)
        private readonly redisService: HraRedisService,
        private readonly queryBus: QueryBus
    ) {}

    public onApplicationBootstrap(): void {
        this.cacheProfile.profiles.push({
            operator: this.getById,
            cacheKeyTemplate: `biz-unit-{bizUnitId}`,
            timeToLiveInMinutes: 60 * 24, // 1 day
        });

        this.redisService.addObjectCacheProfile(this.cacheProfile);
    }
        
    public async getBizUnitById(bizUnitId: string): Promise<GetBizUnitQueryResult|undefined> {
        const cacheProfile = this.cacheProfile.profiles.find(profile => profile.operator === this.getById);
        const cacheKey = cacheProfile.cacheKeyTemplate.replace("{bizUnitId}", bizUnitId);

        const cachedData = await this.yanCacheService.wrap(
            cacheKey,
            async () => {
                // Fetch the data from the database or any other source
                const bizUnit = await this.queryBus.execute(new GetBizUnitQuery(bizUnitId));
                return bizUnit;
            },
            cacheProfile.timeToLiveInMinutes
        );
        return cachedData;
    }
}