import { ICommand } from "@nestjs/cqrs";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export type UseTransactionWith = "entity-manager" | "repository";

export class BulkInsertProjectPayload {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, required: true })
    projectName: string;

    @IsOptional()
    @IsString({ each: true })
    @ApiPropertyOptional({ type: [String], required: false })
    tasks: string[] = [];
}

export class BulkInsertProjectsCommand  implements ICommand {
    constructor(
        public readonly upsertType: UseTransactionWith,
        public readonly payload: BulkInsertProjectPayload[] = []
    ){}
}