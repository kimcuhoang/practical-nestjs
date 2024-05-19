import { IQuery } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export * from "./search-projects.response";

export class SearchProjectsRequest implements IQuery {
    constructor(
        public payload: SearchProjectsPayload
    ) { }
}

export class SearchProjectsPayload {
    @Expose({ name: 'text'})
    @IsOptional()
    @ApiProperty({ required: false, type: String, name: 'text' })
    searchTerm?: string;

    @Expose()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ required: false , type: Number })
    skip?: number;

    @Expose()
    @IsOptional()
    @ApiProperty({ required: false , type: Number })
    take?: number;
}