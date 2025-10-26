import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { BizUnit } from "@src/w-hra-modules/biz-units/domain";
import { DefaultShipmentKeyGenerator, IShipmentKeyGenerator } from "@src/w-hra-modules/shipments/services/shipment-key-generator";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class ShipmentKeyGeneratorService extends DefaultShipmentKeyGenerator implements IShipmentKeyGenerator, OnApplicationBootstrap {
    private readonly logger = new Logger(ShipmentKeyGeneratorService.name);
    constructor(
        @InjectEntityManager()
        protected readonly entityManager: EntityManager,
        @InjectRepository(BizUnit)
        private readonly bizUnitRepository: Repository<BizUnit>
    ) {
        super(entityManager);
    }

    private bizUnit: BizUnit | null = null;

    public async onApplicationBootstrap(): Promise<void> {
        await this.loadSettings();
    }

    public override async loadSettings(): Promise<void> {
        this.logger.log(`Loading Shipment Key Generator settings from BizUnit`);
        this.bizUnit = await this.bizUnitRepository.findOne({
            where: {},
        });
    }

    public override get shipmentKeyPrefix(): string {
        return this.bizUnit?.shipmentKeySettings?.prefix ?? super.shipmentKeyPrefix;
    }

    public override get shipmentKeyTemplate(): string {
        return this.bizUnit?.shipmentKeySettings?.sequenceStart ?? super.shipmentKeyTemplate;
    }

    public override get shipmentKeySequenceEnd(): number {
        return Number(this.bizUnit?.shipmentKeySettings?.sequenceEnd) ?? super.shipmentKeySequenceEnd;
    }
}