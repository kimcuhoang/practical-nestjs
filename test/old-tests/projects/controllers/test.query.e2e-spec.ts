import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Project } from "@src/old-sources/projects/core";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";

describe('ProjectsContoller (e2e)', () => {
    let project: Project;
    let projectRepository: Repository<Project>;
  
    beforeEach(async () => {
      projectRepository = app.get<Repository<Project>>(getRepositoryToken(Project));
      project = Project.create(p => {
        p.name = faker.lorem.sentence(5);
        for(let i = 0; i < 3; i++) {
            p.addTask(task => {
                task.name = faker.lorem.sentence(5);
            });
        }
      });
      await projectRepository.save(project)
    });
  
    afterEach(async () => {
      await projectRepository.delete({});
    });

    test("query-inner-join-and-map", async() => {
        const savedProject = await projectRepository.createQueryBuilder("project")
          .innerJoinAndMapMany("project.tasks", "project.tasks", "task")
          .where("project.id = :id", { id: project.id })
          .getOne();

        console.log(savedProject);
      
        expect(savedProject).toBeDefined();
        expect(savedProject.id).toBe(project.id);
        expect(savedProject.name).toBe(project.name);
        expect(savedProject.tasks).toHaveLength(project.tasks.length);
      
        savedProject.tasks.forEach((task, index) => {
          expect(task.name).toBe(project.tasks[index].name);
        });
    });
});