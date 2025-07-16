import { ICommand } from "@nestjs/cqrs";
import { CreateShipmentPayload } from "./create-shipment.payload";

export class CreateShipmentCommand implements ICommand {
    constructor(
        public readonly payload: CreateShipmentPayload,
    ) {}
}