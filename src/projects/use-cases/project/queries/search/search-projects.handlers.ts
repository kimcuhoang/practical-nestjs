import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchProjectsRequest } from "./search-projects.request";
import { SearchProjectsResponse } from "./search-projects.response";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "@projects/core/project";
import { Repository } from "typeorm";

@QueryHandler(SearchProjectsRequest)
export class SearchProjectsHandler implements IQueryHandler<SearchProjectsRequest, SearchProjectsResponse> {
    constructor(
        @InjectRepository(Project) private readonly projectRepository: Repository<Project>
    ) { }

    async execute(query: SearchProjectsRequest): Promise<SearchProjectsResponse> {
        const [projects, total] = await this.projectRepository.findAndCount();
        return new SearchProjectsResponse(projects, total);
    }
}