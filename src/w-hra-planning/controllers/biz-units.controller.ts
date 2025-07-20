import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { CreateBizUnitCommand, CreateBizUnitPayload } from "@src/w-hra-modules/shipments/use-cases/commands";


@ApiTags("Biz Units")
@Controller("biz-units")
export class BizUnitsControllers {
    constructor(
        private readonly commandBus: CommandBus
    ){}

    @Post()
    public async create(@Body() payload: CreateBizUnitPayload): Promise<string> {
        return await this.commandBus.execute(new CreateBizUnitCommand(payload));
    }
}