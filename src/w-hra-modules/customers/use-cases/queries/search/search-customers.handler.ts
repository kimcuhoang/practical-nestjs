import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchCustomersRequest } from "./search-customers.request";
import { SearchCustomersResult } from "./search-customers.result";
import { Repository } from "typeorm";
import { Customer } from "@src/w-hra-modules/customers/domain";
import { InjectRepository } from "@nestjs/typeorm";

@QueryHandler(SearchCustomersRequest)
export class SearchCustomersHandler implements IQueryHandler<SearchCustomersRequest, SearchCustomersResult> {

    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>
    ){}

    public async execute(query: SearchCustomersRequest): Promise<SearchCustomersResult> {
        const [customers, total] = await this.customerRepository.findAndCount({
            relations: {
                communications: true
            }
        });
        
        return new SearchCustomersResult({
            total: total,
            customers: customers
        });
    }
}