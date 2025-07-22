import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { CreateShipmentCommand, CreateShipmentPayload } from "@src/w-hra-modules/shipments/use-cases/commands";

@ApiTags("Shipments")
@Controller("/shipments")
export class ShipmentsController {
    constructor(
        private readonly commandBus: CommandBus,
    ){}

    @Post()
    public async create(@Body() payload: CreateShipmentPayload): Promise<string>{
        return await this.commandBus.execute(new CreateShipmentCommand(payload));
    }
}