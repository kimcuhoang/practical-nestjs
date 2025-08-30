import { EntitySchema } from "typeorm";
import { BizPartner, BizPartnerCommunication, BizPartnerCustomer, BizPartnerVendor } from "../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";



export const BizPartnerSchema = new EntitySchema<BizPartner>({
    name: BizPartner.name,
    target: BizPartner,
    tableName: snakeCase("BizPartners"),
    columns: {
        ...EntityBaseSchema,
        name: {
            type: String,
            nullable: false,
            length: 400
        },
        group: {
            type: String,
            nullable: false,
            length: 50
        },
        role: {
            type: String,
            nullable: false,
            length: 100
        }
    },
    relations: {
        communications: {
            type: "one-to-many",
            target: BizPartnerCommunication.name,
            inverseSide: "bizPartner",
            cascade: true
        },
        customer: {
            type: "one-to-one",
            target: BizPartnerCustomer.name,
            inverseSide: "bizPartner",
            cascade: true,
        },
        vendor: {
            type: "one-to-one",
            target: BizPartnerVendor.name,
            inverseSide: "bizPartner",
            cascade: true
        }
    }
});