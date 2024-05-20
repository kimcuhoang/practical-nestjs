import { IQuery } from "@nestjs/cqrs";

export * from "./find-by-id.response";

export class FindByIdRequest implements IQuery{
    constructor(public readonly id: string) {}
}