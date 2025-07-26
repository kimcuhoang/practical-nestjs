import { EntitySchema } from "typeorm";
import { BizPartner, BizPartnerCustomer } from "../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { BizPartnerCustomerRegion } from "../../domain/models/biz-partner-customer-region";

export const BizPartnerCustomerSchema = new EntitySchema<BizPartnerCustomer>({
    name: BizPartnerCustomer.name,
    target: BizPartnerCustomer,
    tableName: snakeCase("BizPartnerCustomers"),
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
                foreignKeyConstraintName: snakeCase("FK_BizPartnerCustomers_BizPartners")
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