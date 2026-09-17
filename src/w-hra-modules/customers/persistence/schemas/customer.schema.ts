import { EntitySchema } from "typeorm";
import { Customer, CustomerCommunication } from "../../domain";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const CustomerSchema = new EntitySchema<Customer>({
    name: Customer.name,
    target: Customer,
    tableName: snakeCaseStrategy.tableName("Customers", ""),
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