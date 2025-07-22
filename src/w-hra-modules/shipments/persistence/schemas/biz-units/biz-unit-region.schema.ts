import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { BizUnit, BizUnitRegion } from "@src/w-hra-modules/shipments/domain";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";


export const BizUnitRegionSchema = new EntitySchema<BizUnitRegion>({
    name: BizUnitRegion.name,
    tableName: snakeCase("BizUnitRegions"),
    columns: {
        ...EntityBaseSchema,
        regionCode: {
            type: String,
            length: 2,
            nullable: false
        }
    },
    relations: {
        bizUnit: {
            type: "many-to-one",
            target: BizUnit.name,
            inverseSide: "regions",
            onDelete: "CASCADE",
            joinColumn: {
                name: snakeCase("bizUnitId"),
                referencedColumnName: "id",
                foreignKeyConstraintName: "FK_BizUnitRegion_BizUnit"
            }
        }
    }
});