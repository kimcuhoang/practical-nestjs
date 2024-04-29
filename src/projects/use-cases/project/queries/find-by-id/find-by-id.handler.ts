import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindByIdRequest } from "./find-by-id.request";
import { FindByIdResponse } from "./find-by-id.response";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "@projects/core/project";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import { CachingProvider } from "@src/building-blocks/infra/caching/caching.provider";

@QueryHandler(FindByIdRequest)
export class FindByIdHandler implements IQueryHandler<FindByIdRequest, FindByIdResponse> {

    constructor(
        @InjectRepository(Project) private readonly _projectRepository: Repository<Project>,
        @Inject(CachingProvider) private readonly _cacheProvider: CachingProvider
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