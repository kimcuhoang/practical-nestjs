import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigurationsService } from './building-blocks/infra/configurations/configurations.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(ConfigurationsService) private readonly _configurationService: ConfigurationsService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('/connection-string')
  getConnectionStringV1(): string {
    return this._configurationService.getConnectionStringV1();
  }
  
}
