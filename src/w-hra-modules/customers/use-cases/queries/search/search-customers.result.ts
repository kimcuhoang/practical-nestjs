import { IQueryResult } from "@nestjs/cqrs";
import { Customer } from "@src/w-hra-modules/customers/domain";



export class SearchCustomersResult implements IQueryResult {
    total!: number;
    customers: Customer[];

    constructor(result: Partial<SearchCustomersResult>) {
        Object.assign(this, result);
    }
}