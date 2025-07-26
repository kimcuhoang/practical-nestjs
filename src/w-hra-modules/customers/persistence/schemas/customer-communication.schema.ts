import { EntitySchema } from "typeorm";
import { Customer, CustomerCommunication } from "../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";


export const CustomerCommunicationSchema = new EntitySchema<CustomerCommunication>({
    name: CustomerCommunication.name,
    target: CustomerCommunication,
    tableName: snakeCase("CustomerCommunications"),
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
                name: snakeCase("customerId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCase("FK_CustomerCommunications_Customers")
            }
        }
    }
});