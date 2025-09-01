import { ICommand } from "@nestjs/cqrs";
import { CreateBizUnitPayload } from "./create-biz-unit.payload";


export class CreateBizUnitCommand implements ICommand {
    constructor(
        public readonly payload: CreateBizUnitPayload
    ) {}
}