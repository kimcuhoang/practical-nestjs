import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectPayload } from './use-cases/project/commands/create/create-project.payload';
import { CreateProjectRequest } from './use-cases/project/commands/create/create-project.request';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchProjectsResponse } from './use-cases/project/queries/search/search-projects.response';
import { SearchProjectsRequest } from './use-cases/project/queries/search/search-projects.request';

@ApiTags('Projects Management')
@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) { }

    @Get()
    @ApiResponse({ status: HttpStatus.OK, type: SearchProjectsResponse })
    async search(): Promise<SearchProjectsResponse> {
        const request = new SearchProjectsRequest();
        const response = await this._queryBus.execute(request);
        return response;
    }

    @Post()
    // the response status code is always 200 by default, except for POST requests which are 201
    // https://docs.nestjs.com/controllers#status-code
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, type: String })
    async create(@Body() payload: CreateProjectPayload): Promise<string> {
        const request = new CreateProjectRequest(payload);
        const response = await this._commandBus.execute(request);
        return response;
    }
}
