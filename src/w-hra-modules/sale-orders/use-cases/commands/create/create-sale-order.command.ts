import { ICommand } from "@nestjs/cqrs";
import { CreateSaleOrderPayload } from "./create-sale-order.payload";


export class CreateSaleOrderCommand implements ICommand {
    constructor(
        readonly payload: CreateSaleOrderPayload
    ){}
}