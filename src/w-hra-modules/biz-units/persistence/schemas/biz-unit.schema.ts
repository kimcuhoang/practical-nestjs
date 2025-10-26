import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";
import { BizUnitCommonSettingsSchema } from "./common-settings.schema";
import { BizUnit, BizUnitRegion } from "../../domain";
import { BizUnitsShipmentKeySettingsSchema } from "./shipment-key-settings.schema";
import { ShipmentLaneKeySettingsSchema } from "./shipment-lane-key-settings.schema";


export const BizUnitSchema = new EntitySchema<BizUnit>({
    name: BizUnit.name,
    target: BizUnit,
    tableName: snakeCase("BizUnits"),
    columns: {
        ...EntityBaseSchema,
        bizUnitCode: {
            type: String,
            length: 26,
            nullable: false
        }
    },
    embeddeds: {
        commonSettings: {
            schema: BizUnitCommonSettingsSchema,
            prefix: ""
        },
        shipmentKeySettings: {
            schema: BizUnitsShipmentKeySettingsSchema,
            prefix: "shipment_key",
        },
        shipmentLaneKeySettings: {
            schema: ShipmentLaneKeySettingsSchema,
            prefix: snakeCase("ShipmentLaneKey"),
        }
    },
    relations: {
        regions: {
            type: "one-to-many",
            target: BizUnitRegion.name,
            inverseSide: "bizUnit",
            cascade: true
        }
    }
});