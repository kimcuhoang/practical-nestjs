import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectPayload } from './use-cases/project/commands/create/create-project.payload';
import { CreateProjectRequest } from './use-cases/project/commands/create/create-project.request';
import { ApiResponse } from '@nestjs/swagger';
import { SearchProjectsResponse } from './use-cases/project/queries/search/search-projects.response';
import { SearchProjectsRequest } from './use-cases/project/queries/search/search-projects.request';


@Controller('domain')
export class DomainController {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) { }

    @Get()
    @ApiResponse({ status: 200, type: SearchProjectsResponse })
    async search(): Promise<SearchProjectsResponse> {
        const request = new SearchProjectsRequest();
        const response = await this._queryBus.execute(request);
        return response;
    }

    @Post()
    @ApiResponse({ status: 200, type: String })
    async create(@Body() payload: CreateProjectPayload): Promise<string> {
        const request = new CreateProjectRequest(payload);
        const response = await this._commandBus.execute(request);
        return response;
    }
}
