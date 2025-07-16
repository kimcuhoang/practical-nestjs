import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBizUnitCommand } from "./create-biz-unit.command";
import { BizUnit } from "@src/w-hra-modules/shipments/domain";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@CommandHandler(CreateBizUnitCommand)
export class CreateBizUnitHandler implements ICommandHandler<CreateBizUnitCommand, string> {

    constructor(
        @InjectRepository(BizUnit)
        private readonly bizUnitRepository: Repository<BizUnit>
    ) {}

    public async execute(command: CreateBizUnitCommand): Promise<string> {
        const payload = command.payload;

        const bizUnit = new BizUnit();
        bizUnit.bizUnitCode = payload.bizUnitCode;
        bizUnit.settings = payload.settings;

        for(const region of payload.regions) {
            bizUnit.addBizUnitRegion(region.regionCode);
        }

        const savedBizUnit = await this.bizUnitRepository.save(bizUnit);
        return savedBizUnit.id;
    }
}