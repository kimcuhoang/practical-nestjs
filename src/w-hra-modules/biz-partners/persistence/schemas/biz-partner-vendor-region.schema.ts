import { EntitySchema } from "typeorm";
import { BizPartnerVendorRegion } from "../../domain/models/biz-partner-vendor-region";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { BizPartnerVendor } from "../../domain";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const BizPartnerVendorRegionSchema = new EntitySchema<BizPartnerVendorRegion>({
    name: BizPartnerVendorRegion.name,
    target: BizPartnerVendorRegion,
    tableName: snakeCaseStrategy.tableName("BizPartnerVendorRegions", ""),
    columns: {
        ...EntityBaseSchema,
        bizPartnerVendorId: {
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
        bizPartnerVendor: {
            type: "many-to-one",
            target: BizPartnerVendor.name,
            inverseSide: "regions",
            onDelete: "CASCADE",
            joinColumn: {
                name: snakeCaseStrategy.columnName("bizPartnerVendorId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.relationName("FK_BizPartnerVendorRegions_BizPartnerVendors")
            }
        }
    }
})