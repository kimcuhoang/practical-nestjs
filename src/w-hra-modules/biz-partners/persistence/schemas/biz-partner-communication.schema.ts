import { EntitySchema } from "typeorm";
import { BizPartner, BizPartnerCommunication } from "../../domain";
import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const BizPartnerCommunicationSchema = new EntitySchema<BizPartnerCommunication>({
    name: BizPartnerCommunication.name,
    target: BizPartnerCommunication,
    tableName: snakeCaseStrategy.tableName("BizPartnerCommunications", ""),
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
                name: snakeCaseStrategy.columnName("bizPartnerId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.relationName("FK_BizPartnerCommunications_BizPartners")
            }
        }
    }
});