import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class SolaceReplayRequest {
    
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fromDate?: Date | null;

    @IsOptional()
    @IsString()
    fromMessageId?: string | null;
}