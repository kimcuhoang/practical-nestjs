import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags("App")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  @ApiExcludeEndpoint(true)
  @Redirect("/swagger", HttpStatus.MOVED_PERMANENTLY)
  

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }
}
