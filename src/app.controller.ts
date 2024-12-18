import { Controller, Get, HttpStatus, Inject, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { RedisIoRedisService } from './building-blocks/infra/redis-ioredis';
import { RedisService } from './building-blocks/infra/redis';
import { I18n, I18nContext } from 'nestjs-i18n';
import { faker } from '@faker-js/faker';

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

  @Get("/say-hi")
  public sayHi(@I18n() i18n: I18nContext): string {
    const randomPersonName = faker.person.fullName();
    return i18n.t('common.sayhi', { args: { name: randomPersonName }});
  }
}
