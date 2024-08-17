import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";
import { CreatePersonCommand, CreatePersonPayload } from "./use-cases";

@ApiTags("People")
@Controller("/people")
export class PeopleController {
    constructor(
        private readonly _commandBus: CommandBus
    ){}

    @Post()
    async create(@Body() payload: CreatePersonPayload): Promise<string> {
        const command = new CreatePersonCommand(payload);
        return await this._commandBus.execute(command);
    }
}