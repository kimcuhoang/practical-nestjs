import { EntitySchema } from "typeorm";
import { SaleOrder, SaleOrderItem } from "../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";

export const SaleOrderItemSchema = new EntitySchema<SaleOrderItem>({
    name: SaleOrderItem.name,
    target: SaleOrderItem,
    tableName: snakeCase("SaleOrderItems"),
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
                name: snakeCase("saleOrderId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCase("FK_SaleOrderLineItem_SaleOrder")
            }
        }
    }
})