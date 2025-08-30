import { EntitySchema } from "typeorm";
import { Customer, CustomerCommunication } from "../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";


export const CustomerSchema = new EntitySchema<Customer>({
    name: Customer.name,
    target: Customer,
    tableName: snakeCase("Customers"),
    columns: {
        ...EntityBaseSchema,
        code: {
            type: String,
            nullable: false,
            length: 100
        },
        name: {
            type: String,
            nullable: false,
            length: 100
        }
    },
    relations: {
        communications: {
            type: "one-to-many",
            target: CustomerCommunication.name,
            inverseSide: "customer",
            cascade: true
        }
    }
});