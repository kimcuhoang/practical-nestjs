import { EntitySchema } from "typeorm";
import { BizPartner, BizPartnerVendor } from "../../domain";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { BizPartnerVendorRegion } from "../../domain/models/biz-partner-vendor-region";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const BizPartnerVendorSchema = new EntitySchema<BizPartnerVendor>({
    name: BizPartnerVendor.name,
    target: BizPartnerVendor,
    tableName: snakeCaseStrategy.tableName("BizPartnerVendors", ""),
    columns: {
        ...EntityBaseSchema,
        code: {
            type: String,
            nullable: false,
            length: 100
        },
        shipmentVendorFlag: {
            type: Boolean,
            nullable: false,
            default: false
        }
    },
    relations: {
        bizPartner: {
            type: "one-to-one",
            target: BizPartner.name,
            inverseSide: "vendor",
            onDelete: "CASCADE",
            joinColumn: {
                name: "id",
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.relationName("FK_BizPartnerVendors_BizPartners")
            }
        },
        regions: {
            type: "one-to-many",
            target: BizPartnerVendorRegion.name,
            inverseSide: "bizPartnerVendor",
            cascade: true            
        }
    }
})