import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { CreateCustomerCommand } from "@src/w-hra-modules/customers/use-cases/commands/create/create-customer.command";
import { CustomerPayload } from "@src/w-hra-modules/customers/use-cases/commands/create/payloads";
import { SearchCustomersRequest, SearchCustomersResult } from "@src/w-hra-modules/customers/use-cases/queries";


@ApiTags("Customers")
@Controller("customers")
export class CustomersController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    @Post()
    public async create(@Body() payload: CustomerPayload): Promise<string> {
        return await this.commandBus.execute(new CreateCustomerCommand(payload));
    }

    @Get()
    public async search(): Promise<SearchCustomersResult> {
        return await this.queryBus.execute(new SearchCustomersRequest());
    }
}