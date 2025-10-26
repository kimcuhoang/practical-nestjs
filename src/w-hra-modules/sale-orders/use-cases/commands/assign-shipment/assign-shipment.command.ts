import { ICommand } from "@nestjs/cqrs";


export class AssignShipmentCommand implements ICommand {
    constructor(
        public readonly shipmentCode: string,
        public readonly saleOrderCodes: string[]
    ) {}
}