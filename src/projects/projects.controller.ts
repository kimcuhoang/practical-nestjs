import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { 
    CreateProjectPayload, CreateProjectRequest, 
    FindByIdRequest, FindByIdResponse, 
    SearchProjectsPayload, SearchProjectsRequest, SearchProjectsResponse
} from './use-cases';

@ApiTags('Projects Management')
@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, type: SearchProjectsResponse })
    async search(@Query() payload: SearchProjectsPayload): Promise<SearchProjectsResponse> {
        console.log(`search projects with payload: ${JSON.stringify(payload)}`);
        const request = new SearchProjectsRequest(payload);
        const response = await this._queryBus.execute(request);
        return response;
    }

    @Get('/:id')
    @ApiResponse({ status: HttpStatus.OK, type: FindByIdResponse })
    @ApiParam({ name: 'id', type: String, required: true})
    async findById(@Param('id') id: string): Promise<FindByIdResponse> {
        const request = new FindByIdRequest(id);
        const response = await this._queryBus.execute(request);
        return response;
    }

    @Post()
    // the response status code is always 200 by default, except for POST requests which are 201
    // https://docs.nestjs.com/controllers#status-code
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, type: String })
    async create(@Body() payload: CreateProjectPayload): Promise<string> {
        console.log(`create project with payload: ${JSON.stringify(payload)}`);
        const request = new CreateProjectRequest(payload);
        const response = await this._commandBus.execute(request);
        return response;
    }
}
