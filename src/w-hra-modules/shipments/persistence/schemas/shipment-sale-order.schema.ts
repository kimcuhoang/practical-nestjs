import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { Shipment, ShipmentSaleOrder, ShipmentSaleOrderItem } from "@src/w-hra-modules/shipments/domain";
import { EntitySchema } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const snakeCaseStrategy = new SnakeNamingStrategy();
export const ShipmentSaleOrderSchema = new EntitySchema<ShipmentSaleOrder>({
    name: ShipmentSaleOrder.name,
    target: ShipmentSaleOrder,
    tableName: snakeCaseStrategy.tableName("ShipmentSaleOrders", ""),
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
                name: snakeCaseStrategy.columnName("shipmentId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "ShipmentSaleOrders",
                    ["shipmentId"],
                    "Shipments",
                    ["id"]
                )
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