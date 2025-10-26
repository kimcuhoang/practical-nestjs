import { EntitySchema } from "typeorm";
import { BizPartnerVendorRegion } from "../../domain/models/biz-partner-vendor-region";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { BizPartnerVendor } from "../../domain";


export const BizPartnerVendorRegionSchema = new EntitySchema<BizPartnerVendorRegion>({
    name: BizPartnerVendorRegion.name,
    target: BizPartnerVendorRegion,
    tableName: snakeCase("BizPartnerVendorRegions"),
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
                name: snakeCase("bizPartnerVendorId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCase("FK_BizPartnerVendorRegions_BizPartnerVendors")
            }
        }
    }
})