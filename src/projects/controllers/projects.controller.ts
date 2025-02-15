import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { 
    CreateProjectPayload, CreateProjectRequest, 
    FindByIdRequest, FindByIdResponse, 
    ImportByCsvCommand, 
    SearchProjectsPayload, SearchProjectsRequest, SearchProjectsResponse
} from '../use-cases';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomParseFilePipe } from '@src/building-blocks/infra/pipes/custom-parse-file.pipe';

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
        // console.log(`search projects with payload: ${JSON.stringify(payload)}`);
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
        // console.log(`create project with payload: ${JSON.stringify(payload)}`);
        const request = new CreateProjectRequest(payload);
        const response = await this._commandBus.execute(request);
        return response;
    }

    @Post("/import-csv")
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary"
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    public async import(@UploadedFile() file: Express.Multer.File) {
        const command = new ImportByCsvCommand(file);
        return await this._commandBus.execute(command);
    }
}
