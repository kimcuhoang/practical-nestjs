import { EntitySchema } from "typeorm";
import { BizPartnerCustomerRegion } from "../../domain/models/biz-partner-customer-region";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { BizPartnerCustomer } from "../../domain";

export const BizPartnerCustomerRegionSchema = new EntitySchema<BizPartnerCustomerRegion>({
    name: BizPartnerCustomerRegion.name,
    target: BizPartnerCustomerRegion,
    tableName: snakeCase("BizPartnerCustomerRegions"),
    columns: {
        ...EntityBaseSchema,
        bizPartnerCustomerId: {
            type: String,
            nullable: false,
            length: 26
        },
        region: {
            type: String,
            nullable: false,
            length: 10
        }
    },
    relations: {
        bizPartnerCustomer: {
            type: "many-to-one",
            target: BizPartnerCustomer.name,
            inverseSide: "regions",
            onDelete: "CASCADE",
            orphanedRowAction: "delete",
            joinColumn: {
                name: snakeCase("bizPartnerCustomerId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCase("FK_BizPartnerCustomerRegions_BizPartnerCustomers")
            }
        }
    }
});