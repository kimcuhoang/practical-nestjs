import { EntitySchema } from "typeorm";
import { BizPartner, BizPartnerCustomer } from "../../domain";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { BizPartnerCustomerRegion } from "../../domain/models/biz-partner-customer-region";


const snakeCaseStrategy = new SnakeNamingStrategy();

export const BizPartnerCustomerSchema = new EntitySchema<BizPartnerCustomer>({
    name: BizPartnerCustomer.name,
    target: BizPartnerCustomer,
    tableName: snakeCaseStrategy.tableName("BizPartnerCustomers", ""),
    columns: {
        ...EntityBaseSchema,
        code: {
            type: String,
            nullable: false,
            length: 100
        },
    },
    relations: {
        bizPartner: {
            type: "one-to-one",
            target: BizPartner.name,
            inverseSide: "customer",
            onDelete: "CASCADE",
            joinColumn: {
                name: "id",
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.relationName("FK_BizPartnerCustomers_BizPartners")
            }
        },
        regions: {
            type: "one-to-many",
            target: BizPartnerCustomerRegion.name,
            inverseSide: "bizPartnerCustomer",
            cascade: true
        }
    }
})