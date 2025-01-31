import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification, NotificationChannel, OwnerNotificationType } from "@notifications/core";
import { app } from "@test/test.setup";
import { faker } from "@faker-js/faker";
import { ulid } from "ulidx";

const initNotification = () : Notification => {
    const notification = Notification.init(_ => {
        _.ownerType = "Project";
        _.ownerIdentity = ulid();
        _.ownerNotificationType = OwnerNotificationType.Created,
        _.title = faker.lorem.word({ length: 10 }),
        _.content = faker.lorem.paragraph(4);
        _.notificationChannel = NotificationChannel.Default
    });

    return notification;
}

describe(`Test delete`, () => {
    let notificationRepository: Repository<Notification>;
    let notification: Notification;

    beforeAll(() => {
        notificationRepository = app.get(getRepositoryToken(Notification));
    });

    beforeEach(async() => {
        notification = initNotification();
        await notificationRepository.save(notification);
    });

    afterEach(async() => {
        await notificationRepository.delete({});
    })

    test(`Use delete`, async() => {
        const deleteResult = await notificationRepository.delete({ id: notification.id});
        expect(deleteResult.affected).toBe(1);
    });

    test(`Use delete with not found`, async() => {
        const deleteResult = await notificationRepository.delete({ id: faker.string.uuid()});
        expect(deleteResult.affected).toBe(0);
    });
});