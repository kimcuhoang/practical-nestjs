import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { EntitySchema } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { BizUnit, BizUnitRegion } from "../../domain";

const snakeCaseStrategy = new SnakeNamingStrategy();

export const BizUnitRegionSchema = new EntitySchema<BizUnitRegion>({
    name: BizUnitRegion.name,
    target: BizUnitRegion,
    tableName: snakeCaseStrategy.tableName("BizUnitRegions", ""),
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
                name: snakeCaseStrategy.columnName("bizUnitId", "", []),
                referencedColumnName: "id",
                foreignKeyConstraintName: snakeCaseStrategy.foreignKeyName(
                    "BizUnitRegions",
                    ["bizUnitId"],
                    "BizUnits",
                    ["id"]
                )
            }
        }
    }
});