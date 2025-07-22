import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { Shipment, ShipmentSaleOrder, ShipmentSaleOrderItem } from "@src/w-hra-modules/shipments/domain";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";


export const ShipmentSaleOrderSchema = new EntitySchema<ShipmentSaleOrder>({
    name: ShipmentSaleOrder.name,
    tableName: snakeCase("ShipmentSaleOrders"),
    columns: {
        ...EntityBaseSchema,
        saleOrderCode: {
            type: String,
            length: 26,
            nullable: false
        },
        shipmentId: {
            type: String,
            nullable: false,
            length: 26
        },
        sourceGeographicalKey: {
            type: String,
            length: 26,
            nullable: false
        },
        destinationGeographicalKey: {
            type: String,
            length: 26,
            nullable: false
        }
    },
    relations: {
        shipment: {
            type: "many-to-one",
            target: Shipment.name,
            inverseSide: "saleOrders",
            onDelete: "CASCADE",
            joinColumn: { 
                name: snakeCase("shipmentId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: "FK_ShipmentSaleOrder_Shipment"
            }
        },
        items: {
            type: "one-to-many",
            target: ShipmentSaleOrderItem.name,
            inverseSide: "saleOrder",
            cascade: true,
        }
    }
});