import { EntitySchema } from "typeorm";
import { BizPartner } from "../../models";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { BizPartnerLocation } from "../../models/biz-partner-location";

export const BizPartnerSchema =  new EntitySchema<BizPartner>({
    name: BizPartner.name,
    tableName: snakeCase("BizPartners"),
    columns: {
        ...EntityBaseSchema,
        bizPartnerKey: {
            type: String,
            unique: true,
            length: 50,
        },
        name: {
            type: String,
            length: 100,
            nullable: false,
        },
    },
    relations: {
        locations: {
            type: "one-to-many",
            target: BizPartnerLocation.name,
            inverseSide: "bizPartner",
            cascade: true
        }
    },
});