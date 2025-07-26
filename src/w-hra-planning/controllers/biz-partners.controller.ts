import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { BizPartnerPayload, CreateBizPartnerCommand } from "@src/w-hra-modules/biz-partners/use-cases/commands";


@ApiTags("Biz Partners")
@Controller("biz-partners")
export class BizPartnersController {
    constructor(
        private readonly commandBus: CommandBus
    ){}

    @Post()
    public async create(@Body() payload: BizPartnerPayload): Promise<string> {
        return await this.commandBus.execute(new CreateBizPartnerCommand(payload));
    }
}