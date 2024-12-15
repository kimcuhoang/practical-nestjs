import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { app } from "@test/test.setup";
import { Equal, Repository } from "typeorm";
import { Notification, NotificationChannel, OwnerNotificationType } from "@notifications/core";

const assertSavedNotification = async (repository: Repository<Notification>, notification: Notification): Promise<void> => {
    const savedNotification = await repository.findOne({
        where: {
            id: Equal(notification.id)
        }
    });

    expect(savedNotification).toBeTruthy();
    expect(savedNotification).toMatchObject(notification);
    expect(savedNotification).toStrictEqual({
        ...notification
    } as Notification);
}

describe(`Test persistence for Notifications-Module`, () => {
    let notificationRepository: Repository<Notification>;

    beforeEach(() => {
        notificationRepository = app.get<Repository<Notification>>(getRepositoryToken(Notification));
    });

    afterEach(async() => {
        const deleteResult = await notificationRepository.delete({});
        expect(deleteResult).toBeTruthy();
        expect(deleteResult.affected).toBeGreaterThan(0);
    });

    test(`Save ${Notification.name} successfully`, async() => {
        const notification = Notification.init(_ => {
            _.ownerType = "Project";
            _.ownerIdentity = faker.string.uuid();
            _.ownerNotificationType = OwnerNotificationType.Created,
            _.title = faker.lorem.word({ length: 10 }),
            _.content = faker.lorem.paragraph(4);
            _.notificationChannel = NotificationChannel.Default
        });

        const result = await notificationRepository.save(notification);

        await assertSavedNotification(notificationRepository, notification);
    });
});