import { EntitySchema } from "typeorm";
import { BizPartnerLocation } from "../../models/biz-partner-location";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { snakeCase } from "typeorm/util/StringUtils";
import { BizPartner } from "../../models";


export const BizPartnerLocationSchema = new EntitySchema<BizPartnerLocation>({
    name: BizPartnerLocation.name,
    tableName: snakeCase("BizPartnerLocations"),
    columns: {
        ...EntityBaseSchema,
        bizPartnerId: {
            type: String,
            nullable: false
        },
        locationKey: {
            type: String,
            nullable: false
        },
        address: {
            type: String,
            nullable: false
        }
    },
    relations: {
        bizPartner: {
            type: "many-to-one",
            target: BizPartner.name,
            joinColumn: { 
                name: "bizPartnerId",
                referencedColumnName: "id",
                foreignKeyConstraintName: "FK_BizPartnerLocation_BizPartner"
            },
            onDelete: "CASCADE"
        }
    }
});