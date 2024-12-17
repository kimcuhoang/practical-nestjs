import { BeforeInsert, EntitySchemaColumnOptions } from "typeorm";

export const EntityBaseSchema = {
    id: {
        type: 'uuid',
        primary: true,
        nullable: false
    } as EntitySchemaColumnOptions,

    deleted: {
        type: Boolean,
        nullable: true
    } as EntitySchemaColumnOptions,

    createdAt: {
        type: Date,
        nullable: false,
        createdDate: true,
    } as EntitySchemaColumnOptions,

    modifiedAt: {
        type: Date,
        updateDate: true,
        nullable: true,
    } as EntitySchemaColumnOptions,

    deletedAt: {
        type: Date,
        deleteDate: true,
        nullable: true
    } as EntitySchemaColumnOptions,
};