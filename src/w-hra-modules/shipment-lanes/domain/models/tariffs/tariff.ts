import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { ShipmentLane } from "../shipment-lane";
import { TariffValidity } from "./tariff-validity";

export class Tariff extends EntityBase {
    code!: string;
    bizPartnerCode!: string;
    preferred: boolean;

    shipmentLaneId!: string;
    shipmentLane!: ShipmentLane;

    validities: TariffValidity[];

    constructor(shipmentLane?: ShipmentLane, tariff?: Pick<Tariff, 'bizPartnerCode' | 'preferred'>) {
        super();
        Object.assign(this, {
            shipmentLane: shipmentLane,
            shipmentLaneId: shipmentLane?.id,
            ...tariff
        })
    }

    public addValidity(validity: Pick<TariffValidity, 'validFrom' | 'validTo'>): TariffValidity {
        this.validities ??= [];
        
        const tariffValidity = new TariffValidity(this, validity);
        this.validities.push(tariffValidity);

        return tariffValidity;
    }

}