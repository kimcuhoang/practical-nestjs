import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetBizUnitQuery } from "./get-biz-unit.query";
import { GetBizUnitQueryResult } from "./get-biz-unit.result";
import { InjectRepository } from "@nestjs/typeorm";
import { BizUnit } from "@src/w-hra-modules/biz-units/domain";
import { Repository } from "typeorm";


@QueryHandler(GetBizUnitQuery)
export class GetBizUnitQueryHandler implements IQueryHandler<GetBizUnitQuery, GetBizUnitQueryResult> {
    constructor(
        @InjectRepository(BizUnit)
        private readonly bizUnitRepository: Repository<BizUnit>,
    ) { }


    public async execute(query: GetBizUnitQuery): Promise<GetBizUnitQueryResult> {
        const bizUnit = await this.bizUnitRepository.findOneOrFail({
            where: { id: query.bizUnitId },
            relations: {
                regions: true,
                commonSettings: true,
                shipmentKeySettings: true,
                shipmentLaneKeySettings: true,
            }
        });

        return new GetBizUnitQueryResult(bizUnit);
    }
}