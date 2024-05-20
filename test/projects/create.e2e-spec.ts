import { HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { Guid } from 'guid-typescript';
import { app, httpServer } from '@test/test.setup';
import { faker } from '@faker-js/faker'
import { Project } from '@src/projects/core';
import { CreateProjectPayload } from '@src/projects/use-cases';


describe('ProjectsController (e2e)', () => {
  let projectRepository: Repository<Project>;
  const url = '/projects';

  beforeEach(() => {
    projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
  });

  afterEach(async () => {
    await projectRepository.delete({});
  });

  test('create-01', async () => {
    const payload = {
      projectName: faker.lorem.sentence(5),
      tasks: [
        { taskName: faker.lorem.sentence(5) },
        { taskName: faker.lorem.sentence(5) }
      ]
    } as CreateProjectPayload;

    const response = await request(httpServer).post(url).send(payload);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.text).not.toEqual(Guid.EMPTY.toString());

    const project = await projectRepository.findOne({ 
      relations: { tasks: true },
      where: { id: response.text } 
    });
    expect(project).toBeDefined();
    expect(project.name).toBe(payload.projectName);
    expect(project.tasks).toHaveLength(payload.tasks.length);

    project.tasks.forEach(task => {
      const taskPayload = payload.tasks.find(t => t.taskName === task.name);
      expect(taskPayload).toBeDefined();
    });
  });

  test('create-02', async () => {
    const payload = new CreateProjectPayload();
    const response = await request(httpServer).post(url).send(payload);
    
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);

    const errors = response.body.message as string[];
    expect(errors.find(e => e.startsWith('projectName'))).toBeDefined();
  });

});
