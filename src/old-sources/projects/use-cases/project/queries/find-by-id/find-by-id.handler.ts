import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindByIdRequest } from "./find-by-id.request";
import { FindByIdResponse } from "./find-by-id.response";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "@src/old-sources/projects/core";
import { CachingProvider } from "@building-blocks/infra/caching";

@QueryHandler(FindByIdRequest)
export class FindByIdHandler implements IQueryHandler<FindByIdRequest, FindByIdResponse> {

    constructor(
        @InjectRepository(Project) 
        private readonly _projectRepository: Repository<Project>,
        private readonly _cacheProvider: CachingProvider
    ){}

    async execute(query: FindByIdRequest): Promise<FindByIdResponse> {

        const taskGetProject = this._projectRepository.findOne({
                relations: {
                    tasks: true
                },
                where: { id: query.id }
            });

        const project = await this._cacheProvider
                .getOrSetIfMissing<Project>(`project-${query.id}`, taskGetProject, 60);

        // const project = await this._projectRepository.findOne({
        //     relations: {
        //         tasks: true
        //     },
        //     where: { id: query.id }
        // });
        
        return new FindByIdResponse(project);
    }
}