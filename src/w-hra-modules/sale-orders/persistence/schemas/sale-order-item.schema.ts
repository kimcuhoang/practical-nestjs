import { EntitySchema } from "typeorm";
import { SaleOrder, SaleOrderItem } from "../../domain";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const SaleOrderItemSchema = new EntitySchema<SaleOrderItem>({
    name: SaleOrderItem.name,
    target: SaleOrderItem,
    tableName: snakeCaseStrategy.tableName("SaleOrderItems", ""),
    columns: {
        ...EntityBaseSchema,
        saleOrderId: {
            type: String,
            nullable: false,
            length: 26
        },
        productKey: {
            type: String,
            nullable: false,
            length: 26
        },
        quantity: {
            type: "int",
            nullable: false
        }
    },
    relations: {
        saleOrder: {
            type: "many-to-one",
            target: SaleOrder.name,
            inverseSide: "items",
            onDelete: "CASCADE",
            joinColumn: {
                name: snakeCaseStrategy.columnName("saleOrderId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "SaleOrderItems",
                    ["saleOrderId"],
                    "SaleOrders",
                    ["id"]
                )
            }
        }
    }
})