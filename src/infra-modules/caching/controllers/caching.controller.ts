import { Body, Controller, Delete, Get, Inject, Param, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { CachingService } from "../caching.service";


@ApiTags("Caching")
@Controller("caching")
export class CachingController {
    constructor(
        @Inject(CachingService.name)
        private readonly cachingService: CachingService
    ){}

    @Post(":cacheKey")
    @ApiBody({ schema: { type: 'object', additionalProperties: true } })
    public async insertCache(@Param("cacheKey") cacheKey: string, @Body() body: any): Promise<void> {
        await this.cachingService.set(cacheKey, body);
    }

    @Get(":cacheKey")
    public async getCache(@Param("cacheKey") cacheKey: string): Promise<any> {
        return await this.cachingService.get(cacheKey);
    }

    @Delete(":cacheKey")
    public async deleteCache(@Param("cacheKey") cacheKey: string): Promise<void> {
        await this.cachingService.del(cacheKey);
    }
}