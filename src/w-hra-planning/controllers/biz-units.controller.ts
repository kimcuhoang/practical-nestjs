import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { CreateBizUnitCommand, CreateBizUnitPayload } from "@src/w-hra-modules/biz-units/use-cases/commands";
import { GetBizUnitQueryResult } from "@src/w-hra-modules/biz-units/use-cases/queries";
import { BizUnitsService } from "../services/biz-units/biz-units.service";


@ApiTags("Biz Units")
@Controller("biz-units")
export class BizUnitsControllers {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly bizUnitsService: BizUnitsService
    ){}

    @Post()
    public async create(@Body() payload: CreateBizUnitPayload): Promise<string> {
        return await this.commandBus.execute(new CreateBizUnitCommand(payload));
    }

    @Get("/:id")
    public async get(@Param("id") id: string): Promise<GetBizUnitQueryResult> {
        return await this.bizUnitsService.getBizUnitById(id);
    }
}