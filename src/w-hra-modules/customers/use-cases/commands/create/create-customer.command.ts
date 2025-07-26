import { ICommand } from "@nestjs/cqrs";
import { CustomerPayload } from "./payloads";


export class CreateCustomerCommand implements ICommand {
    constructor(
        public readonly payload: CustomerPayload
    ){}
}