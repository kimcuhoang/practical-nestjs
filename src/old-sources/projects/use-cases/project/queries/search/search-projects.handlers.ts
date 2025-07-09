import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SearchProjectsPayload, SearchProjectsRequest } from "./search-projects.request";
import { SearchProjectsResponse } from "./search-projects.response";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "@src/old-sources/projects/core";
import { FindOptionsWhere, ILike, Repository } from "typeorm";

@QueryHandler(SearchProjectsRequest)
export class SearchProjectsHandler implements IQueryHandler<SearchProjectsRequest, SearchProjectsResponse> {
    constructor(
        @InjectRepository(Project) 
        private readonly projectRepository: Repository<Project>
    ) { }

    async execute(query: SearchProjectsRequest): Promise<SearchProjectsResponse> {
        const payload = query.payload;

        const criteria: FindOptionsWhere<Project> = {};

        if (Boolean(payload.searchTerm)) {
            criteria.name = ILike(`%${payload.searchTerm}%`);
        }

        const [projects, total] = await this.projectRepository.findAndCount({
            relations: {
                tasks: true
            },
            where: criteria,
            order: {
                name: 'ASC'
            },
            skip: payload.skip! < 0 ? 0 : payload.skip!,
            take: payload.take! < 1 || payload.take! > 10 ? 10 : payload.take!
        });
        
        return new SearchProjectsResponse(projects, total);
    }
}