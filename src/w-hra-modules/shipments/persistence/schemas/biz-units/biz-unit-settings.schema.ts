import { BizUnitSettings } from "@src/w-hra-modules/shipments/domain";
import { EntitySchema } from "typeorm";


export const BizUnitSettingsSchema = new EntitySchema<BizUnitSettings>({
    name: BizUnitSettings.name,
    columns: {
        countryCode: {
            type: String,
            length: 2,
            nullable: false
        },
        timeZone: {
            type: String,
            length: 10,
            nullable: false
        }
    }
});