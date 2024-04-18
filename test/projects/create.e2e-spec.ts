import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { Guid } from 'guid-typescript';
import { app, httpServer } from '@test/test.setup';
import { Repository } from 'typeorm';
import { Project } from '@src/projects/core/project';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProjectsController (e2e)', () => {
  let projectRepository: Repository<Project>;
  const url = '/projects';

  beforeEach(() => {
    projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
  });

  afterEach(async () => {
    await projectRepository.clear();
  });

  it(`${url} (POST)`, async () => {
    const response = await request(httpServer).post(url).send({ name: 'test' });
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.text).not.toEqual(Guid.EMPTY.toString());

    const project = await projectRepository.findOne({ where: { id: response.text } });
    expect(project).toBeDefined();
    expect(project.name).toEqual('test');
  });

});
