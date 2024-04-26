import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchProjectsRequest } from "./search-projects.request";
import { SearchProjectsResponse } from "./search-projects.response";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "@projects/core/project";
import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { Task } from "@src/projects/core/task";

@QueryHandler(SearchProjectsRequest)
export class SearchProjectsHandler implements IQueryHandler<SearchProjectsRequest, SearchProjectsResponse> {
    constructor(
        @InjectRepository(Project) private readonly projectRepository: Repository<Project>
    ) { }

    async execute(query: SearchProjectsRequest): Promise<SearchProjectsResponse> {
        return await this.executeViaQueryBuilder(query);
    }

    private async executeViaQueryBuilder(request: SearchProjectsRequest): Promise<SearchProjectsResponse> {
        let queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.tasks', 'task');

        const searchTerm = request.searchTermSanitized();

        if (!!searchTerm) {
            
            const queryProjectsHasTaskNameLike = queryBuilder
                .select("project.id")
                .where('task.name ILIKE :searchTerm', { searchTerm: searchTerm });

            const query = queryProjectsHasTaskNameLike.getQuery();
            const parameters = queryProjectsHasTaskNameLike.getParameters();

            queryBuilder = queryBuilder
                .where('project.name ILIKE :searchTerm', { searchTerm: searchTerm })
                .orWhere(`project.id IN (${query})`, parameters);
        }

        const [projects, total] = await queryBuilder
            .select("project").addSelect("task")
            .getManyAndCount();

        return new SearchProjectsResponse(projects, total);
    }

    private async executeViaRepository(request: SearchProjectsRequest): Promise<SearchProjectsResponse> {

        const taskFilterOptions: FindOptionsWhere<Task> | FindOptionsWhere<Task>[] = !!request.searchTerm
            ? { name: ILike(request.searchTerm) }
            : {};


        const projectFilterOptions: FindOptionsWhere<Project> | FindOptionsWhere<Project>[] = !!request.searchTerm
            ?
            [
                { name: ILike(request.searchTerm) },
                { tasks: taskFilterOptions }
            ]
            : {};

        const [projects, total] = await this.projectRepository.findAndCount({
            relations: {
                tasks: true
            },
            where: projectFilterOptions
        });
        return new SearchProjectsResponse(projects, total);
    }

    
}