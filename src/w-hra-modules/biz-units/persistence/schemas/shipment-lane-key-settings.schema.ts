import { EntitySchema } from "typeorm";
import { ShipmentLaneKeySettings } from "../../domain/models/value-objects/shipment-lane-key-settings";


export const ShipmentLaneKeySettingsSchema = new EntitySchema<ShipmentLaneKeySettings>({
    name: ShipmentLaneKeySettings.name,
    target: ShipmentLaneKeySettings,
    columns: {
        prefix: {
            type: String,
            length: 50,
            nullable: false
        },
        template: {
            type: String,
            length: 100,
            nullable: false
        }
    }
});