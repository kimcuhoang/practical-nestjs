import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags("App")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @ApiExcludeEndpoint(true)
  @Redirect("/swagger", HttpStatus.MOVED_PERMANENTLY)
  redirectToSwagger() {
    // This method will be redirected, so its body can be empty or return any value
    return;
  }
}
