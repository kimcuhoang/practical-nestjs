import { EntitySchema } from "typeorm";
import { SaleOrder, SaleOrderShipmentHistory } from "../../domain";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const SaleOrderShipmentHistorySchema = new EntitySchema<SaleOrderShipmentHistory>({
    name: SaleOrderShipmentHistory.name,
    target: SaleOrderShipmentHistory,
    tableName: snakeCaseStrategy.tableName("SaleOrderShipmentHistories", ""),
    columns: {
        ...EntityBaseSchema,
        saleOrderId: {
            type: String,
            nullable: false,
            length: 36,
        },
        shipmentKey: {
            type: String,
            nullable: false,
            length: 36,
        },
    },
    relations: {
        saleOrder: {
            type: "many-to-one",
            target: SaleOrder.name,
            inverseSide: "shipmentHistories",
            onDelete: "CASCADE",
            joinColumn: {
                name: snakeCaseStrategy.columnName("saleOrderId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "SaleOrderShipmentHistories",
                    ["saleOrderId"],
                    "SaleOrders",
                    ["id"]
                )
            }
        }
    }

});