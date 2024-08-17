import { ICommand } from "@nestjs/cqrs";
import { CreatePersonPayload } from "./create-person.payload";


export class CreatePersonCommand implements ICommand {
    constructor(
        public readonly payload: CreatePersonPayload
    ){}
}