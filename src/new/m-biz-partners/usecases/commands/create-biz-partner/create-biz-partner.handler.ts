import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBizPartnerCommand } from "./create-biz-partner.command";
import { Repository } from "typeorm";
import { BizPartner, BizPartnerLocation } from "@src/new/m-biz-partners/models";
import { plainToInstance } from "class-transformer";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Inject } from "@nestjs/common";
import { BaseBizPartnerVerificationService, BizPartnerVerificationService } from "@src/new/m-biz-partners/services/biz-partner-verification.service";

@CommandHandler(CreateBizPartnerCommand)
export class CreateBizPartnerHandler implements ICommandHandler<CreateBizPartnerCommand, string> {

    constructor(
        @InjectRepository(BizPartner)
        private readonly bizPartnerRepository: Repository<BizPartner>,
        @Inject(BaseBizPartnerVerificationService)
        private readonly bizPartnerVerificationService: BaseBizPartnerVerificationService
    ) {}

    public async execute(command: CreateBizPartnerCommand): Promise<string> {
        const payload = command.payload;

        const bizPartner = new BizPartner();
        bizPartner.bizPartnerKey = payload.bizPartnerKey;
        bizPartner.name = payload.name;

        for (let index = 0; index < payload.locations.length; index++) {
            const location = payload.locations[index];
            bizPartner.addLocation({
                locationKey: location.locationKey,
                address: location.address
            });
        }

        const canAddBizPartner = await this.bizPartnerVerificationService.verifyWhenAdding(bizPartner);
        if (!canAddBizPartner) {
            throw new BadRequestException(`The Business-Partner-Key has not been allowed to add`);
        }

        const savedResult = await this.bizPartnerRepository.save(bizPartner);
        return savedResult.id;
    }
}