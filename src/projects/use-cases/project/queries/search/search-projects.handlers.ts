import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchProjectsPayload, SearchProjectsRequest } from "./search-projects.request";
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
        return await this.executeViaQueryBuilder(query.payload);
    }

    private async executeViaQueryBuilder(payload: SearchProjectsPayload): Promise<SearchProjectsResponse> {
        let queryBuilder = this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect('project.tasks', 'task');

        const searchTerm = !!payload.searchTerm ? `%${payload.searchTerm}%` : '';

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

        queryBuilder = queryBuilder
                .select("project").addSelect("task")
                .orderBy('project.name', 'ASC')
                .skip(payload.skip! < 0 ? 0 : payload.skip!) 
                .take(payload.take! < 1 || payload.take! > 10 ? 10 : payload.take!);

        const [projects, total] = await queryBuilder.getManyAndCount()
        return new SearchProjectsResponse(projects, total);
    }

    // private async executeViaRepository(request: SearchProjectsRequest): Promise<SearchProjectsResponse> {

    //     const taskFilterOptions: FindOptionsWhere<Task> | FindOptionsWhere<Task>[] = !!request.searchTerm
    //         ? { name: ILike(request.searchTerm) }
    //         : {};


    //     const projectFilterOptions: FindOptionsWhere<Project> | FindOptionsWhere<Project>[] = !!request.searchTerm
    //         ?
    //         [
    //             { name: ILike(request.searchTerm) },
    //             { tasks: taskFilterOptions }
    //         ]
    //         : {};

    //     const [projects, total] = await this.projectRepository.findAndCount({
    //         relations: {
    //             tasks: true
    //         },
    //         where: projectFilterOptions
    //     });
    //     return new SearchProjectsResponse(projects, total);
    // }

    
}