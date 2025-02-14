import { HttpStatus } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '@projects/core/project';
import { app, request } from '@test/test.setup';
import { faker } from '@faker-js/faker';
import { CachingProvider } from '@building-blocks/infra/caching/caching.provider';


describe('ProjectsController (e2e)', () => {
  let project: Project;
  let projectRepository: Repository<Project>;
  const url = '/projects';

  beforeEach(async () => {
    projectRepository = app.get(getRepositoryToken(Project));
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

  it("GET-projects/id", async () => {
    const response = await request.get(`${url}/${project.id}`);
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toMatchObject({ id: project.id, name: project.name });
    expect(response.body.tasks).toHaveLength(project.tasks.length);

    response.body.tasks.forEach((task: { name: string; }) => {
      const taskPayload = project.tasks.find(t => t.name === task.name);
      expect(taskPayload).toBeDefined();
    });

    const cachingProvider = app.get<CachingProvider>(CachingProvider);
    const cachedProject = await cachingProvider.get<Project>(`project-${project.id}`);

    console.log(`cachedProject: ${JSON.stringify(cachedProject)}`);
    expect(cachedProject).toMatchObject({ id: project.id, name: project.name });
    
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

    expect(savedProject).toBeDefined();
    expect(savedProject).toMatchObject({ id: project.id, name: project.name });
    expect(savedProject.tasks).toHaveLength(project.tasks.length);

    savedProject.tasks.forEach(task => {
      const taskPayload = project.tasks.find(t => t.name === task.name);
      expect(taskPayload).toBeDefined();
    });
  });

  
});
