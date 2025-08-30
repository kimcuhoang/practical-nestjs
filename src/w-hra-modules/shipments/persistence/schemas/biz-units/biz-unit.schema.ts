import { EntityBaseSchema } from "@src/infra-modules/database/persistence/schemas/entity-base-schema";
import { BizUnit, BizUnitRegion } from "@src/w-hra-modules/shipments/domain";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";
import { BizUnitSettingsSchema } from "./biz-unit-settings.schema";


export const BizUnitSchema = new EntitySchema<BizUnit>({
    name: BizUnit.name,
    target: BizUnit,
    tableName: snakeCase("BizUnits"),
    columns: {
        ...EntityBaseSchema,
        bizUnitCode: {
            type: String,
            length: 26,
            nullable: false
        }
    },
    embeddeds: {
        settings: {
            schema: BizUnitSettingsSchema,
            prefix: ""
        }
    },
    relations: {
        regions: {
            type: "one-to-many",
            target: BizUnitRegion.name,
            inverseSide: "bizUnit",
            cascade: true
        }
    }
});