import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BizUnit } from "@src/w-hra-modules/biz-units/domain";
import { IShipmentKeyGenerator } from "@src/w-hra-modules/shipments/services/shipment-key-generator";
import { Repository } from "typeorm";

@Injectable()
export class ShipmentKeyGeneratorService implements IShipmentKeyGenerator {

    constructor(
        @InjectRepository(BizUnit)
        private readonly bizUnitRepository: Repository<BizUnit>
    ) { }

    public async generate(): Promise<string> {
        const bizUnit = await this.bizUnitRepository.findOne({
            where: {},
        });

        if(!bizUnit) 
            throw new Error("No BizUnit found to generate Shipment Key");

        if(!bizUnit.shipmentKeySettings?.prefix)
            throw new Error("BizUnit has no Shipment Key Prefix defined");

        if(!bizUnit.shipmentKeySettings?.sequenceStart)
            throw new Error("BizUnit has no Shipment Key Sequence Start defined");

        if(!bizUnit.shipmentKeySettings?.sequenceEnd)
            throw new Error("BizUnit has no Shipment Key Sequence Step defined");

        const prefix = bizUnit.shipmentKeySettings.prefix;
        const sequenceStart = bizUnit.shipmentKeySettings.sequenceStart;
        const sequenceEnd = bizUnit.shipmentKeySettings.sequenceEnd;

        const nextSequenceValue = await this.getNextSequenceValue();
        const nextShipmentCode = `${prefix}${String(nextSequenceValue).padStart(sequenceStart.length, '0')}`;
        if (nextShipmentCode === `${prefix}${sequenceEnd}`) {
            throw new Error("Shipment Key Sequence has reached its maximum value");
        }

        return nextShipmentCode;
    }

    private async getNextSequenceValue(): Promise<number> {
        const result = await this.bizUnitRepository.query(`SELECT nextval('public.shipment_sequence') as nextval`);
        return result[0].nextval;
    }
}