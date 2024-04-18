import { IQuery } from "@nestjs/cqrs";

export class FindByIdRequest implements IQuery{
    constructor(public readonly id: string) {}
}