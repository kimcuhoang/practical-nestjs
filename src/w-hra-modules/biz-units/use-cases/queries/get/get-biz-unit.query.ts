import { IQuery } from "@nestjs/cqrs";

export class GetBizUnitQuery implements IQuery {
    constructor(
        public readonly bizUnitId: string
    ) {}
}