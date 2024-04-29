import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigurationsService } from './building-blocks/infra/configurations/configurations.service';
import { RedisService } from './building-blocks/infra/redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(ConfigurationsService) private readonly _configurationService: ConfigurationsService,
    private readonly _redisService: RedisService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('/connection-string')
  getConnectionStringV1(): string {
    return this._configurationService.getConnectionStringV1();
  }

  @Get('redis/ping')
  async pingRedis(): Promise<string> {
    return await this._redisService.ping();
  }
  
}
