import { faker } from "@faker-js/faker";
import { ProjectCreated } from "@integration-events/project-events/project-created";
import { EventBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Notification } from "@notifications/core";
import { app } from "@test/test.setup";
import { Equal, Repository } from "typeorm";


describe(`A ${ProjectCreated.name} event`, () => {
    let eventBus: EventBus;
    let notificationRepository: Repository<Notification>;
    let event: ProjectCreated;

    beforeAll(() => {
        eventBus = app.get<EventBus>(EventBus);
        notificationRepository = app.get<Repository<Notification>>(getRepositoryToken(Notification));
    });

    afterEach(async() => {
        await notificationRepository.delete({});
    });

    test("Should be handled correctly", async() => {
        event = new ProjectCreated({
            projectId: faker.string.uuid(),
            projectName: faker.lorem.word(5)
        });
        await eventBus.publish(event);

        await new Promise(resolve => setTimeout(resolve, 1000));

        const notification = await notificationRepository.findOne({
            where: {
                ownerIdentity: Equal(event.projectId)
            }
        });

        expect(notification).toBeTruthy();
        expect(notification).toMatchObject({} as Notification);
    });
});