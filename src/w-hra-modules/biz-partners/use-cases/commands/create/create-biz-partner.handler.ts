import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateBizPartnerCommand } from "./create-biz-partner.command";
import { InjectRepository } from "@nestjs/typeorm";
import { BizPartner } from "@src/w-hra-modules/biz-partners/domain";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { BizPartnerCreated } from "@src/w-hra-modules/biz-partners/integration-events";

@CommandHandler(CreateBizPartnerCommand)
export class CreateBizPartnerHandler implements ICommandHandler<CreateBizPartnerCommand, string> {

    constructor(
        @InjectRepository(BizPartner)
        private readonly bizPartnerRepository: Repository<BizPartner>,
        private readonly eventBus: EventBus
    ){}

    public async execute(command: CreateBizPartnerCommand): Promise<string> {
        const payload = command.payload;
        const bizPartner = plainToInstance(BizPartner, payload);

        payload.customer.regions.forEach(r => bizPartner.customer.assignToRegion(r));
        payload.vendor.regions.forEach(r => bizPartner.vendor.assignToRegion(r));

        const savedResult = await this.bizPartnerRepository.save(bizPartner);
        this.eventBus.publish(new BizPartnerCreated({
            bizPartner: savedResult,
            payload
        }));
        return savedResult.id;
    }

}