import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@src/projects/core/project';
import { app, httpServer } from '@test/test.setup';

describe('ProjectsContoller (e2e)', () => {
  let project: Project;
  let projectRepository: Repository<Project>;
  const url = '/projects';

  beforeEach(async () => {
    projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
    project = Project.create(p => {
      p.name = 'test';
    });
    await projectRepository.save(project)
  });

  afterEach(async () => {
    await projectRepository.clear();
  });

  it(`${url}/:id (GET)`, async () => {
    const response = await request(httpServer).get(`${url}/${project.id}`);
    console.log(response.body);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({ id: project.id, name: project.name });
  });
});
