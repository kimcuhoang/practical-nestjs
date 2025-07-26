import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBizPartnerCommand } from "./create-biz-partner.command";
import { InjectRepository } from "@nestjs/typeorm";
import { BizPartner } from "@src/w-hra-modules/biz-partners/domain";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";

@CommandHandler(CreateBizPartnerCommand)
export class CreateBizPartnerHandler implements ICommandHandler<CreateBizPartnerCommand, string> {

    constructor(
        @InjectRepository(BizPartner)
        private readonly bizPartnerRepository: Repository<BizPartner>
    ){}

    public async execute(command: CreateBizPartnerCommand): Promise<string> {
        const payload = command.payload;
        const bizPartner = plainToInstance(BizPartner, payload);

        payload.customer.regions.forEach(r => bizPartner.customer.assignToRegion(r));
        payload.vendor.regions.forEach(r => bizPartner.vendor.assignToRegion(r));

        const savedResult = await this.bizPartnerRepository.save(bizPartner);
        return savedResult.id;
    }

}