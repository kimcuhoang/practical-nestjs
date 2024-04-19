import { HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { Guid } from 'guid-typescript';
import { app, httpServer } from '@test/test.setup';
import { Project } from '@src/projects/core/project';


describe('ProjectsController (e2e)', () => {
  let projectRepository: Repository<Project>;
  const url = '/projects';

  beforeEach(() => {
    projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
  });

  afterEach(async () => {
    await projectRepository.delete({});
  });

  it('create-01', async () => {
    const payload = {
      name: 'test',
      tasks: [
        { name: 'task 1' },
        { name: 'task 2' }
      ]
    }
    const response = await request(httpServer).post(url).send(payload);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.text).not.toEqual(Guid.EMPTY.toString());

    const project = await projectRepository.findOne({ where: { id: response.text } });
    expect(project).toBeDefined();
    expect(project.name).toEqual('test');
  });

});
