import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@src/projects/core/project';
import { app, httpServer } from '@test/test.setup';
import { faker } from '@faker-js/faker';

describe('ProjectsContoller (e2e)', () => {
  let project: Project;
  let projectRepository: Repository<Project>;
  const url = '/projects';

  beforeEach(async () => {
    projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
    project = Project.create(p => {
      p.name = faker.lorem.sentence(5);
      p.addTask(task => {
        task.name = faker.lorem.sentence(5);
      })
    });
    await projectRepository.save(project)
  });

  afterEach(async () => {
    await projectRepository.delete({});
  });

  it("query-project-by-id", async () => {
    const savedProject = await projectRepository.findOne({
      //relationLoadStrategy: "join", // This is important to load the relations: query = 2 calls, join = 1 call
      relations: {
        tasks: true
      },
      where: {
        id: project.id,
        tasks: {
          name: ILike(`%${project.tasks[0].name.substring(0, 5)}%`)
        }
      }
    });

    console.log(savedProject);
    expect(savedProject).toBeDefined();
    expect(savedProject).toMatchObject({ id: project.id, name: project.name });
    expect(savedProject.tasks).toHaveLength(project.tasks.length);

    savedProject.tasks.forEach(task => {
      const taskPayload = project.tasks.find(t => t.name === task.name);
      expect(taskPayload).toBeDefined();
    });

  });

  it("GET-projects/id", async () => {
    const response = await request(httpServer).get(`${url}/${project.id}`);
    console.log(response.body);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({ id: project.id, name: project.name });
    expect(response.body.tasks).toHaveLength(project.tasks.length);

    response.body.tasks.forEach((task: { name: string; }) => {
      const taskPayload = project.tasks.find(t => t.name === task.name);
      expect(taskPayload).toBeDefined();
    });
    
  });
});
