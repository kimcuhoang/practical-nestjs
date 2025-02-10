import { EntityBase } from "@building-blocks/domains/entity-base";
import { ulid } from "ulidx";


export class Notification extends EntityBase {
    constructor(id: string) {
        super(id);
    }

    ownerType: string;
    ownerIdentity: string;
    ownerNotificationType: string;

    notificationChannel: string;
    title: string;
    content: string;

    public static init(configure: (notification: Notification) => void) {
        const notification = new Notification(ulid());
        configure(notification);
        return notification;
    }
}