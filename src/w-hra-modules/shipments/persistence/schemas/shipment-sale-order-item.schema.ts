import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { ShipmentSaleOrder, ShipmentSaleOrderItem } from "@src/w-hra-modules/shipments/domain";
import { EntitySchema } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const snakeCaseStrategy = new SnakeNamingStrategy();
export const ShipmentSaleOrderItemSchema = new EntitySchema<ShipmentSaleOrderItem>({
    name: ShipmentSaleOrderItem.name,
    target: ShipmentSaleOrderItem,
    tableName: snakeCaseStrategy.tableName("ShipmentSaleOrderItems", ""),
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
                name: snakeCaseStrategy.columnName("saleOrderId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "ShipmentSaleOrderItems",
                    ["saleOrderId"],
                    "ShipmentSaleOrders",
                    ["id"]
                )
            },
        }
    }
});