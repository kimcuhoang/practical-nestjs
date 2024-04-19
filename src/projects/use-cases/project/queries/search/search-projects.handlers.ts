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

        const filterOptions : FindOptionsWhere<Project> = !!query.searchTerm  
            ? { name: ILike(`%${query.searchTerm}%`) }
            : { } ;

        const [projects, total] = await this.projectRepository.findAndCount({
            where: filterOptions
        });
        return new SearchProjectsResponse(projects, total);
    }
}