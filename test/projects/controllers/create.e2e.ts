import { HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { app, request } from '@test/test.setup';
import { faker } from '@faker-js/faker'
import { Project } from '@projects/core';
import { CreateProjectPayload } from '@projects/use-cases';
import { Notification } from '@notifications/core';
import { ProjectCreatedHandler } from '@src/notifications/event-handlers/project-created.handler';
import { ValidationError } from 'class-validator';


const assertSavedProject = async (repository: Repository<Project>, projectId: string, payload: CreateProjectPayload): Promise<void> => {

  const project = await repository.findOne({
    relations: { tasks: true },
    where: { id: projectId }
  });

  expect(project).toBeTruthy();
  expect(project.name).toBe(payload.projectName);

  if (!payload.tasks || payload.tasks.length === 0) return;

  expect(project.tasks).toHaveLength(payload.tasks.length);

  project.tasks.forEach(task => {
    const taskPayload = payload.tasks.find(t => t.taskName === task.name);
    expect(taskPayload).toBeDefined();
  });

};

const assertSavedNotification = async (repository: Repository<Notification>, projectId: string, assert: (notification: Notification | undefined) => void = null): Promise<void> => {
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const notification = await repository.findOne({
    where: {
      ownerIdentity: projectId
    }
  });

  if (assert) {
    assert(notification);
    return;
  }

  expect(notification).toBeTruthy();
  expect(notification).toMatchObject({} as Notification);

};

describe('ProjectsController (e2e)', () => {
  let projectRepository: Repository<Project>;
  let notificationRepository: Repository<Notification>;
  const url = '/projects';

  beforeAll(() => {
    projectRepository = app.get(getRepositoryToken(Project));
    notificationRepository = app.get(getRepositoryToken(Notification));
  });

  afterEach(async () => {
    await projectRepository.delete({});
  });

  test(`create-01: successfully create ${Project.name} but not ${Notification.name} due to errors `, async () => {

    const payload = {
      projectName: "Created but none notification"
    };

    const eventHandler = app.get<ProjectCreatedHandler>(ProjectCreatedHandler);
    const spyInstance = jest.spyOn(eventHandler, "handle").mockRejectedValue(new Error("Expect this error must occur!!!"));

    const response = await request.post(url).send(payload);
    expect(response.status).toBe(HttpStatus.OK);

    await expect(spyInstance).rejects.toThrow(Error);

    const projectId = response.text;
    expect(projectId).toBeTruthy();
    await assertSavedProject(projectRepository, projectId, payload as CreateProjectPayload);

    await assertSavedNotification(notificationRepository, projectId, notification => {
      expect(notification).toBeFalsy();
    });

    spyInstance.mockRestore(); // Or, setup `restoreMocks: true,` in `jest.config.ts`
  });

  test(`create-02: fail due to validations`, async () => {
    const response = await request
      .post(url).send({})
      .expect(HttpStatus.BAD_REQUEST);

    const errors = response.body.message as ValidationError[];

    console.dir(errors);

    const properties = errors.map(_ => { return _.property });
    expect(properties).toContain('projectName');
  });

  test(`create-03: successfully create ${Project.name} & ${Notification.name}`, async () => {
    const payload = {
      projectName: faker.lorem.sentence(5),
      tasks: [
        { taskName: faker.lorem.sentence(5) },
        { taskName: faker.lorem.sentence(5) }
      ]
    };

    const response = await request
      .post(url)
      .send(payload)
      .expect(HttpStatus.OK);

    const projectId = response.text;
    expect(projectId).toBeTruthy();

    await assertSavedProject(projectRepository, projectId, payload as CreateProjectPayload);

    await assertSavedNotification(notificationRepository, projectId);
  });

});
