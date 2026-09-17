import { EntitySchema } from "typeorm";
import { SaleOrder, SaleOrderItem, SaleOrderShipmentHistory } from "../../domain";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const SaleOrderSchema = new EntitySchema<SaleOrder>({
    name: SaleOrder.name,
    target: SaleOrder,
    tableName: snakeCaseStrategy.tableName("SaleOrders", ""),
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