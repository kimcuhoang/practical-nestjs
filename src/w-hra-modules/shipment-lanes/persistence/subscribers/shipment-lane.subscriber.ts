import { DataSource, EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { ShipmentLane } from "../../domain";
import { ShipmentLaneSequence } from "../sequences";
import { Inject, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { IShipmentLaneKeySettingsService, SHIPMENT_LANE_KEY_SETTINGS_SERVICE } from "../../services/shipment-lane-key-settings";


@Injectable()
@EventSubscriber()
export class ShipmentLaneSubscriber implements EntitySubscriberInterface<ShipmentLane> {

    constructor(
        @InjectDataSource() 
        private readonly dataSource: DataSource,
        @Inject(SHIPMENT_LANE_KEY_SETTINGS_SERVICE)
        private readonly shipmentLaneKeySettingsService: IShipmentLaneKeySettingsService
    ) {
        this.dataSource.subscribers.push(this);
    }

    listenTo() {
        return ShipmentLane;
    }

    public async beforeInsert(event: InsertEvent<ShipmentLane>): Promise<void> {
        const entityManager = event.manager;
        const entity = event.entity;

        const nextValue = await this.getNextSequenceValue(entityManager);

        const codeTemplate = this.shipmentLaneKeySettingsService.template;
        const prefix = this.shipmentLaneKeySettingsService.prefix;

        entity.code = `${prefix}${String(nextValue).padStart(codeTemplate.length, '0')}`
    }

    private async getNextSequenceValue(entityManager: EntityManager): Promise<number> {
        const result = await entityManager.query(`SELECT nextval('public.${ShipmentLaneSequence}') as nextval`);
        return result[0].nextval;
    }

}