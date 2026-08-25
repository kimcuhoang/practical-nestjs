import { Inject, Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { YAN_CACHE_SERVICE } from "@src/infra-modules/cache/cache.symbols";
import { HraCacheService } from "@src/infra-modules/cache/services/cache.service";
import { GetBizUnitQuery } from "@src/w-hra-modules/biz-units/use-cases/queries";

@Injectable()
export class BizUnitsService {
    constructor(
        @Inject(YAN_CACHE_SERVICE)
        private readonly yanCacheService: HraCacheService,
        private readonly queryBus: QueryBus
    ) {}
        
    public async getBizUnitById(bizUnitId: string): Promise<any> {
        const cacheKey = `biz-unit-${bizUnitId}`;
        const cachedData = await this.yanCacheService.wrap(
            cacheKey,
            async () => {
                // Fetch the data from the database or any other source
                const bizUnit = await this.queryBus.execute(new GetBizUnitQuery(bizUnitId));
                return bizUnit;
            },
            60 * 60 * 24
        );
        return cachedData;
    }
}