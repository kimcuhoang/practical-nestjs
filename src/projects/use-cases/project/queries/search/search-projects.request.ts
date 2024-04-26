import { IQuery } from "@nestjs/cqrs";

export class SearchProjectsRequest implements IQuery {
    constructor(
        public searchTerm?: string
    ){}

    public searchTermSanitized(): string {
        return !!this.searchTerm ? `%${this.searchTerm}%` : '';
    }
}