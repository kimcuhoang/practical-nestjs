import { EntitySchema } from "typeorm";
import { EntityBaseSchema } from "@building-blocks/infra/database/schemas/entity-base-schema";
import { Notification } from "@notifications/core";
import { snakeCase } from "typeorm/util/StringUtils";

// import { SnakeNamingStrategy } from "typeorm-naming-strategies";
// const snakeCase = new SnakeNamingStrategy();

export const NotificationSchema = new EntitySchema<Notification>({
    name: Notification.name,
    tableName: snakeCase("Notifications"),
    columns: {
        ...EntityBaseSchema,
        ownerType: {
            type: String,
            nullable: false,
        },
        ownerIdentity: {
            type: String,
            nullable: false,
            length: 26 // ulid length
        },
        ownerNotificationType: {
            type: String,
            nullable: false
        },
        title: {
            type: String,
            nullable: false
        },
        content: {
            type: String,
            nullable: false
        },
        notificationChannel: {
            type: String,
            nullable: false
        }
    }
    
});