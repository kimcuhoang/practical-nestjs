import { EntityBase } from "@src/infra-modules/database/domain/entity-base";
import { Tariff } from "./tariffs/tariff";

export class ShipmentLane extends EntityBase {
    code!: string;
    description: string | null;

    tariffs: Tariff[];

    constructor(){ super(); }

    public addTariff(option: Pick<Tariff, "bizPartnerCode" | "preferred">): Tariff {
        this.tariffs ??= [];
        
        if (this.tariffs.find(t => t.bizPartnerCode === option.bizPartnerCode)) {
            throw new Error(`Tariff with bizPartnerCode ${option.bizPartnerCode} already exists in ShipmentLane ${this.code}`);
        }
        const tariff = new Tariff(this, option);
        this.tariffs.push(tariff);

        return tariff;
    }
}