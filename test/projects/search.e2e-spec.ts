import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@src/projects/core/project';
import { app, httpServer } from '@test/test.setup';
import { faker } from '@faker-js/faker';

const numberOfProjects = 4;
const testCases = [
  { searchTerm: "task 0 của dự án 0", totalResults: 1 },
  // { searchTerm: "dự án", totalResults: numberOfProjects },
  // { searchTerm: "", totalResults: numberOfProjects },
];

describe.each(testCases)('GET-projects?text=', ({ searchTerm, totalResults }) => {

  let projects: Project[] = [];
  let projectRepository: Repository<Project>;
  const url = '/projects';

  it(`Search project by text:"${searchTerm}"`, async () => {

    const searchTermQuery = encodeURIComponent(searchTerm);
    const requestUrl = `${url}?searchTerm=${searchTermQuery}&skip=0&take=10`;
    const response = await request(httpServer).get(requestUrl);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.projects.length).toBe(totalResults);
    expect(response.body.total).toBe(totalResults);

    const projects = response.body.projects;
    projects.forEach(project => {
      expect(project.id).toBeDefined();
      expect(project.name).toBeDefined();
      expect(project.tasks).toBeDefined();
    });
  });

  beforeEach(async () => {

    projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));

    for (let i = 0; i < numberOfProjects - 1; i++) {
      const project = Project.create(p => {

        p.name = `Đây là cái dự án ${i}`;

        const numberOfTasks = faker.number.int({ min: 1, max: 3 });

        for (let j = 0; j < numberOfTasks; j++) {
          p.addTask(task => {
            task.name = `Đây là cái task ${j} của dự án ${i}`;
          });
        }
      });
      projects.push(project);
    }

    projects.push(Project.create(p => {
      p.name = "Dự án không có task";
    }));

    await projectRepository.save(projects)
  });

  afterEach(async () => {
    await projectRepository.delete({});
  });
}); // End of test
