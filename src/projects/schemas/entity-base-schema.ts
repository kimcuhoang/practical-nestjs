import { EntitySchemaColumnOptions } from "typeorm";

export const EntityBaseSchema = {
    id: {
        type: 'uuid',
        primary: true,
        nullable: false
    } as EntitySchemaColumnOptions
};