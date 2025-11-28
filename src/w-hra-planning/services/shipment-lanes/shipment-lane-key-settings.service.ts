import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BizUnit } from "@src/w-hra-modules/biz-units/domain";
import { DefaultShipmentLaneKeySettingsService, IShipmentLaneKeySettingsService } from "@src/w-hra-modules/shipment-lanes/services/shipment-lane-key-settings";
import { Repository } from "typeorm";


@Injectable()
export class ShipmentLaneKeySettingsService extends DefaultShipmentLaneKeySettingsService implements IShipmentLaneKeySettingsService, OnApplicationBootstrap {

    private readonly logger = new Logger(ShipmentLaneKeySettingsService.name);

    private bizUnit: BizUnit | null = null;

    constructor(
        @InjectRepository(BizUnit)
        private readonly bizUnitRepository: Repository<BizUnit>
    ) {
        super();
    }


    public async onApplicationBootstrap(): Promise<void> {
        await this.loadShipmentLaneKeySettings();
    }

    public async loadShipmentLaneKeySettings(): Promise<void> {
        this.logger.log(`Loading Shipment Lane Key Settings from BizUnit`);
        this.bizUnit = await this.bizUnitRepository.findOne({
            where: {},
        });
    }

    public get prefix(): string {
        return this.bizUnit?.shipmentLaneKeySettings?.prefix ?? super.prefix;
    }

    public get template(): string {
        return this.bizUnit?.shipmentLaneKeySettings?.template ?? super.template;
    }

}