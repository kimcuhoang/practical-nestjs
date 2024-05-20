import { Controller, Get, HttpStatus, Inject, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigurationsService } from './building-blocks/infra/configurations/configurations.service';
import { RedisService12 } from './building-blocks/infra/redis/redis12.service';
import { RedisService } from './building-blocks/infra/redis/redis.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags("App")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(ConfigurationsService) private readonly _configurationService: ConfigurationsService,
    private readonly _redisService: RedisService,
    private readonly _redisService12: RedisService12
  ) {}

  @Get("")
  @ApiExcludeEndpoint(true)
  @Redirect("/swagger", HttpStatus.MOVED_PERMANENTLY)
  

  @Get("hello")
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

  @Get('redis12/ping')
  async pingRedis12(): Promise<string> {
    return await this._redisService12.ping();
  }
  
}
