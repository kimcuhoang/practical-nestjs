import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@src/projects/core/project';
import { app, request } from '@test/test.setup';
import { faker } from '@faker-js/faker';
import { ProjectDto } from '@src/projects/use-cases';

const numberOfProjects = 4;
const testCases = [
  { searchTerm: "dự án", totalResults: numberOfProjects },
  { searchTerm: "", totalResults: numberOfProjects }
];

describe.each(testCases)('GET-projects?text=', ({ searchTerm, totalResults }) => {

  let projects: Project[] = [];
  let projectRepository: Repository<Project>;
  const url = '/projects';

  test(`Search project by text:"${searchTerm}"`, async () => {

    // const searchTermQuery = encodeURIComponent(searchTerm);
    // const skip = 0;
    // const take = 100;
    // const requestUrl = `${url}?text=${searchTermQuery}&skip=${skip}&take=${take}`;

    const requestParams = new URLSearchParams({
      skip: "0",
      take: "100",
      text: searchTerm
    });

    const requestUrl = `${url}?${requestParams.toString()}`;

    const response = await request
        .get(requestUrl)
        .expect(HttpStatus.OK);

    const projects = response.body.projects 
    const total = response.body.total;

    expect(projects.length).toBe(totalResults);
    expect(total).toBe(totalResults);

    projects.forEach((project: ProjectDto) => {
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
