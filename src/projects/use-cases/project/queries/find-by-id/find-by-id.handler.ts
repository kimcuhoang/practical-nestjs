import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindByIdRequest } from "./find-by-id.request";
import { FindByIdResponse } from "./find-by-id.response";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "@projects/core/project";
import { Repository } from "typeorm";

@QueryHandler(FindByIdRequest)
export class FindByIdHandler implements IQueryHandler<FindByIdRequest, FindByIdResponse> {

    constructor(
        @InjectRepository(Project) private readonly _projectRepository: Repository<Project>
    ){}

    async execute(query: FindByIdRequest): Promise<FindByIdResponse> {

        const project = await this._projectRepository.findOne({
            where: { id: query.id }
        });
        
        return new FindByIdResponse(project);
    }
}