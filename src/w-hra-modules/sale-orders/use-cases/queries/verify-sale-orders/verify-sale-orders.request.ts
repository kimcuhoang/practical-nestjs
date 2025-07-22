import { IQuery } from "@nestjs/cqrs";


export class VerifySaleOrdersRequest implements IQuery {
    constructor(
        public readonly saleOrderKeys: string[]
    ) {}
}