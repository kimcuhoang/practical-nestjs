import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@src/projects/core/project';
import { app, httpServer } from '@test/test.setup';

describe('Search projects (e2e)', () => {
  let project: Project;
  let projectRepository: Repository<Project>;
  const url = '/projects';

  beforeEach(async () => {
    projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
    project = Project.create(p => {
      p.name = 'Đây là cái dự án';
    });
    await projectRepository.save(project)
  });

  afterEach(async () => {
    await projectRepository.delete({});
  });

  it(`${url} (GET)`, async () => {
    const response = await request(httpServer).get(url);
    console.log(response.body);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.projects).toHaveLength(1);
    expect(response.body.total).toBeGreaterThanOrEqual(1);
  });

  it(`${url}?text= (GET)`, async () => {
    const searchTerm = encodeURIComponent("dự án");
    const requestUrl = `${url}?text=${searchTerm}`;
    const response = await request(httpServer).get(requestUrl);
    console.log(response.body);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.projects).toHaveLength(1);
    expect(response.body.total).toBeGreaterThanOrEqual(1);
  });
});
