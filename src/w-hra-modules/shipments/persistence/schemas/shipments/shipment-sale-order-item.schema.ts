import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { ShipmentSaleOrder, ShipmentSaleOrderItem } from "@src/w-hra-modules/shipments/domain";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";


export const ShipmentSaleOrderItemSchema = new EntitySchema<ShipmentSaleOrderItem>({
    name: ShipmentSaleOrderItem.name,
    tableName: snakeCase("ShipmentSaleOrderItems"),
    columns: {
        ...EntityBaseSchema,
        productCode: {
            type: String,
            length: 26,
            nullable: false
        },
        quantity: {
            type: Number,
            nullable: false
        }
    },
    relations: {
        saleOrder: {
            type: "many-to-one",
            target: ShipmentSaleOrder.name,
            inverseSide: "items",
            onDelete: "CASCADE",
            joinColumn: { 
                name: snakeCase("saleOrderId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: "FK_ShipmentSaleOrderItem_ShipmentSaleOrder" 
            },
        }
    }
});