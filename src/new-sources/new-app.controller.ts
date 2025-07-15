import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("New App")
@Controller("new-app")
export class NewAppController {

    @Get("/ping")
    public ping(): string {
        return "pong";
    }
}