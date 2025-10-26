import { EntitySchema } from "typeorm";
import { CommonSettings } from "../../domain";


export const BizUnitCommonSettingsSchema = new EntitySchema<CommonSettings>({
    name: CommonSettings.name,
    target: CommonSettings,
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