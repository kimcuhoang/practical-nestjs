import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@src/projects/core/project';
import { app, httpServer } from '@test/test.setup';

describe('GET-projects', () => {
  let projects: Project[] = [];
  let projectRepository: Repository<Project>;
  const url = '/projects';

  beforeEach(async () => {
    projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
    for (let i = 0; i < 10; i++) {
      const project = Project.create(p => {
        p.name = `Đây là cái dự án ${i}`;
        p.addTask(task => {
          task.name = `Đây là cái task của dự án ${i}`;
        });
      });
      await projectRepository.save(project);
      projects.push(project);
    }

    await projectRepository.save(projects)
  });

  afterEach(async () => {
    await projectRepository.delete({});
  });

  it("GET-projects", async () => {
    const response = await request(httpServer).get(url);
    
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.projects).toHaveLength(projects.length);
    expect(response.body.total).toBeGreaterThanOrEqual(projects.length);
  });

  it("GET-projects/text", async () => {
    const searchTerm = encodeURIComponent("dự án");
    const requestUrl = `${url}?text=${searchTerm}`;
    const response = await request(httpServer).get(requestUrl);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.projects).toHaveLength(projects.length);
    expect(response.body.total).toBeGreaterThanOrEqual(projects.length);
  });
});
