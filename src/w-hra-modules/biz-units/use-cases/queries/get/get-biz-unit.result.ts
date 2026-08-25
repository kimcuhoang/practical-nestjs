import { IQueryResult } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { BizUnit } from "@src/w-hra-modules/biz-units/domain";


export class GetBizUnitQueryResult implements IQueryResult {
    @ApiProperty()
    id: string;

    @ApiProperty()
    bizUnitCode: string;

    constructor(bizUnit: BizUnit) {
        Object.assign(this, bizUnit);
    }
}