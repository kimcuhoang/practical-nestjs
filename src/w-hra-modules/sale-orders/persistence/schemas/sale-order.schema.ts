import { EntitySchema } from "typeorm";
import { SaleOrder, SaleOrderItem, SaleOrderShipmentHistory } from "../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";


export const SaleOrderSchema = new EntitySchema<SaleOrder>({
    name: SaleOrder.name,
    target: SaleOrder,
    tableName: snakeCase("SaleOrders"),
    columns: {
        ...EntityBaseSchema,
        saleOrderCode: {
            type: String,
            nullable: false,
            length: 26
        },
        sourceGeographicalKey: {
            type: String,
            nullable: false,
            length: 26
        },
        destinationGeographicalKey: {
            type: String,
            nullable: false,
            length: 26
        },
        regionCode: {
            type: String,
            nullable: false,
            length: 10
        },
        shipmentKey: {
            type: String,
            nullable: true,
            length: 26
        }
    },
    relations: {
        items: {
            type: "one-to-many",
            target: SaleOrderItem.name,
            inverseSide: "saleOrder",
            cascade: true
        },
        shipmentHistories: {
            type: "one-to-many",
            target: SaleOrderShipmentHistory.name,
            inverseSide: "saleOrder",
            cascade: true
        }
    }
});