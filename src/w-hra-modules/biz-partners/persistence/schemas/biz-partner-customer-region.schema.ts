import { EntitySchema } from "typeorm";
import { BizPartnerCustomerRegion } from "../../domain/models/biz-partner-customer-region";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { BizPartnerCustomer } from "../../domain";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const BizPartnerCustomerRegionSchema = new EntitySchema<BizPartnerCustomerRegion>({
    name: BizPartnerCustomerRegion.name,
    target: BizPartnerCustomerRegion,
    tableName: snakeCaseStrategy.tableName("BizPartnerCustomerRegions", ""),
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
                name: snakeCaseStrategy.columnName("bizPartnerCustomerId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.relationName("FK_BizPartnerCustomerRegions_BizPartnerCustomers")
            }
        }
    }
});