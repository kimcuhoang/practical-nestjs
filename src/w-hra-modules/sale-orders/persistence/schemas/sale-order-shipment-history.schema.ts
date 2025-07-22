import { EntitySchema } from "typeorm";
import { SaleOrder, SaleOrderShipmentHistory } from "../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";


export const SaleOrderShipmentHistorySchema = new EntitySchema<SaleOrderShipmentHistory>({
    name: SaleOrderShipmentHistory.name,
    tableName: snakeCase("SaleOrderShipmentHistories"),
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
                name: snakeCase("saleOrderId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: "FK_SaleOrderShipmentHistory_SaleOrder"
            }
        }
    }

});