import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CommandBus } from "@nestjs/cqrs";
import { CreateSaleOrderCommand, CreateSaleOrderPayload } from "@src/w-hra-modules/sale-orders/use-cases/commands";

@ApiTags("Sale Orders")
@Controller("sale-orders")
export class SaleOrdersController {
    constructor(
        private readonly commandBus: CommandBus
    ){ }

    @Post()
    public async create(@Body() payload: CreateSaleOrderPayload): Promise<string> {
        return await this.commandBus.execute(new CreateSaleOrderCommand(payload));
    }
}