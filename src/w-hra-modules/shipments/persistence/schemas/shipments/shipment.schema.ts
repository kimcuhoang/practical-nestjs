import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { Shipment, ShipmentSaleOrder } from "@src/w-hra-modules/shipments/domain";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";


export const ShipmentSchema = new EntitySchema<Shipment>({
    name: Shipment.name,
    tableName: snakeCase("Shipments"),
    columns: {
        ...EntityBaseSchema,
        shipmentCode: {
            type: String,
            length: 26,
            nullable: false
        },
        bizUnitCode: {
            type: String,
            length: 26,
            nullable: false
        },
        regionCode: {
            type: String,
            length: 2,
            nullable: false
        },
        startFromDateTime: {
            type: Date,
            nullable: false
        },
        finishToDateTime: {
            type: Date,
            nullable: false
        },
        sourceGeographyCode: {
            type: String,
            length: 26,
            nullable: false
        },
        destinationGeographyCode: {
            type: String,
            length: 26,
            nullable: false
        }
    },
    relations: {
        saleOrders: {
            type: "one-to-many",
            target: ShipmentSaleOrder.name,
            inverseSide: "shipment",
            cascade: true
        }
    }
});