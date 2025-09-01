import { EntitySchema } from "typeorm";
import { ShipmentKeySettings } from "../../domain/models/value-objects/shipment-key-settings";


export const BizUnitsShipmentKeySettingsSchema = new EntitySchema<ShipmentKeySettings>({
    name: ShipmentKeySettings.name,
    target: ShipmentKeySettings,
    columns: {
        prefix: {
            type: String,
            length: 10,
            nullable: false
        },
        sequenceStart: {
            type: String, 
            length: 10,
            nullable: false
        },
        sequenceEnd: {
            type: String,
            length: 10,
            nullable: false
        }
    }
});