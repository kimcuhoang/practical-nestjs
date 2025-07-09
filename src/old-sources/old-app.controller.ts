import { faker } from '@faker-js/faker';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RedisService } from '@src/building-blocks/infra/redis';
import { RedisIoRedisService } from '@src/building-blocks/infra/redis-ioredis';
import { I18n, I18nContext } from 'nestjs-i18n';
import { LocalizationsService } from './localizations';


@ApiTags("Old-App")
@Controller()
export class OldAppController {
  constructor(
    private readonly _redisIoRedisService: RedisIoRedisService,
    private readonly _redisService: RedisService,
    private readonly localizationsService: LocalizationsService
  ) {}


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
    return this.localizationsService.translate("common.sayhi", { name: randomPersonName });
  }
}
