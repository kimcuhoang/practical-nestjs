import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@src/old-sources/projects/core/project';
import { app } from '@test/test.setup';
import { faker } from '@faker-js/faker';

const numberOfProjects = 4;
const searchTermText = "task 0 của dự án 0";

const testCases = [
  { searchTerm: searchTermText, totalResults: 1 },
  { searchTerm: "dự án", totalResults: numberOfProjects },
  { searchTerm: "", totalResults: numberOfProjects },
];

describe.each(testCases)("Query projects by text", ({ searchTerm, totalResults }) => {
  let projectRepository: Repository<Project>;
  let projects: Project[] = [];

  it(`Text: "${searchTerm}"`, async () => {

    let queryBuilder = projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'task');

    if (!!searchTerm) {

      const queryProjectsHasTaskNameLike = queryBuilder
        .select("project.id")
        .where('task.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` });

      const query = queryProjectsHasTaskNameLike.getQuery();
      const parameters = queryProjectsHasTaskNameLike.getParameters();

      queryBuilder = queryBuilder
        .where('project.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
        .orWhere(`project.id IN (${query})`, parameters);

    }

    const [projects, total] = await queryBuilder
      .select("project").addSelect("task")
      .getManyAndCount();

    // console.log(JSON.stringify(projects, null, 2));
    // const outputTest = projects.map(p => p.name);
    // console.log("Output: ", outputTest);
    // console.log("Total: ", total);

    expect(projects.length).toBe(totalResults);
    expect(total).toBe(totalResults);

    projects.forEach(project => {
      expect(project.name).toBeDefined();
      expect(project.tasks).toBeDefined();
    });
  });

  beforeAll(async () => {
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

  afterAll(async () => {
    await projectRepository.delete({});
  });


});