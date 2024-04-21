import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchProjectsRequest } from "./search-projects.request";
import { SearchProjectsResponse } from "./search-projects.response";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "@projects/core/project";
import { FindOptionsWhere, ILike, Repository } from "typeorm";

@QueryHandler(SearchProjectsRequest)
export class SearchProjectsHandler implements IQueryHandler<SearchProjectsRequest, SearchProjectsResponse> {
    constructor(
        @InjectRepository(Project) private readonly projectRepository: Repository<Project>
    ) { }

    async execute(query: SearchProjectsRequest): Promise<SearchProjectsResponse> {

        const searchTerm = !!query.searchTerm ? `%${query.searchTerm}%` : '';
        
        const filterOptions : FindOptionsWhere<Project> | FindOptionsWhere<Project>[] = !!query.searchTerm  
            ? 
            [
                { name: ILike(searchTerm) },
                { tasks: { name: ILike(searchTerm) } }
            ] 
            : {} ;

        const [projects, total] = await this.projectRepository.findAndCount({
            relations: {
                tasks: true
            },
            where: filterOptions
        });
        return new SearchProjectsResponse(projects, total);
    }
}