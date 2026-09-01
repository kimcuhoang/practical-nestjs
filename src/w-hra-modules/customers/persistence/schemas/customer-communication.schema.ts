import { EntitySchema } from "typeorm";
import { Customer, CustomerCommunication } from "../../domain";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const CustomerCommunicationSchema = new EntitySchema<CustomerCommunication>({
    name: CustomerCommunication.name,
    target: CustomerCommunication,
    tableName: snakeCaseStrategy.tableName("CustomerCommunications", ""),
    columns: {
        ...EntityBaseSchema,
        customerId: {
            type: String,
            nullable: false,
            length: 26
        },
        type: {
            type: String,
            nullable: false,
            length: 100
        },
        value: {
            type: String,
            nullable: false,
            length: 100
        }
    },
    relations: {
        customer: {
            type: "many-to-one",
            target: Customer.name,
            inverseSide: "communications",
            onDelete: "CASCADE",
            orphanedRowAction: "delete",
            joinColumn: {
                name: snakeCaseStrategy.columnName("customerId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "CustomerCommunications",
                    ["customerId"],
                    "Customers",
                    ["id"]
                )
            }
        }
    }
});