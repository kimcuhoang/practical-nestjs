import { Controller, Get, HttpStatus, Inject, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './building-blocks/infra/redis/redis.service';
import { RedisIoRedisService } from './building-blocks/infra/redis-ioredis/redis-ioredis.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags("App")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly _redisIoRedisService: RedisIoRedisService,
    private readonly _redisService: RedisService
  ) {}

  @Get("")
  @ApiExcludeEndpoint(true)
  @Redirect("/swagger", HttpStatus.MOVED_PERMANENTLY)
  

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redis-ioredis/ping')
  async pingRedisIoRedis(): Promise<string> {
    return await this._redisIoRedisService.ping();
  }

  @Get('redis/ping')
  async pingRedis(): Promise<string> {
    return await this._redisService.ping();
  }
  
}
