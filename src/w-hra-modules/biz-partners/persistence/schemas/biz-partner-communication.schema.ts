import { EntitySchema } from "typeorm";
import { BizPartner, BizPartnerCommunication } from "../../domain";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";


export const BizPartnerCommunicationSchema = new EntitySchema<BizPartnerCommunication>({
    name: BizPartnerCommunication.name,
    target: BizPartnerCommunication,
    tableName: snakeCase("BizPartnerCommunications"),
    columns: {
        ...EntityBaseSchema,
        bizPartnerId: {
            type: String,
            nullable: false,
            length: 26,
        },
        communicationType: {
            type: String,
            nullable: false,
            length: 100
        },
        value: {
            type: String,
            nullable: false,
            length: 300
        }
    },
    relations: {
        bizPartner: {
            type: "many-to-one",
            target: BizPartner.name,
            inverseSide: "communications",
            onDelete: "CASCADE",
            orphanedRowAction: "delete",
            joinColumn: {
                name: snakeCase("bizPartnerId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCase("FK_BizPartnerCommunications_BizPartners")
            }
        }
    }
});