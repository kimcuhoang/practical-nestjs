import { IQuery } from "@nestjs/cqrs";

export class SearchProjectsRequest implements IQuery {
    constructor(
        public searchTerm?: string
    ){}
}