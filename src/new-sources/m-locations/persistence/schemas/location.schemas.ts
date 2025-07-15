import { EntitySchema } from "typeorm";
import { Location } from "../../models";
import { snakeCase } from "typeorm/util/StringUtils";
import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";


export const LocationSchema = new EntitySchema<Location>({
    name: Location.name,
    tableName: snakeCase("Locations"),
    columns: {
        ...EntityBaseSchema,
        name: {
            type: String,
            length: 200,
            nullable: false
        },
        unit: {
            type: String,
            length: 40,
            nullable: false
        }
    }
});