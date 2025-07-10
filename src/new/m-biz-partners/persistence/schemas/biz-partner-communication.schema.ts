import { snakeCase } from "typeorm/util/StringUtils";
import { BizPartnerCommunication } from "../../models/biz-partner-communication";
import { EntitySchema } from "typeorm";
import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { BizPartner } from "../../models";


export const BizPartnerCommunicationSchema = new EntitySchema<BizPartnerCommunication>({
    name: BizPartnerCommunication.name,
    tableName: snakeCase("BizPartnerCommunications"),
    columns: {
        ...EntityBaseSchema,
        bizPartnerId: {
            type: String,
            nullable: false,
            length: 26
        },
        communicationType: {
            type: String,
            nullable: false,
            length: 50,
        },
        value: {
            type: String,
            nullable: false,
            length: 100
        }
    },
    relations: {
        bizPartner: {
            type: "many-to-one",
            target: BizPartner.name,
            inverseSide: "communications",
            joinColumn: {
                name: "bizPartnerId",
                referencedColumnName: "id",
                foreignKeyConstraintName: "FK_BizPartnerCommunication_BizPartner"
            },
            onDelete: "CASCADE"
        }
    }
});