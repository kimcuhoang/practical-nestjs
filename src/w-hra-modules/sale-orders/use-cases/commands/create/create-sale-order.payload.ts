import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsString, Min } from "class-validator";


export class CreateSaleOrderItemPayload
{
    @IsString()
    @IsNotEmpty()
    productKey!: string;

    @IsInt()
    @Min(1)
    quantity!: number;
}

export class CreateSaleOrderPayload
{
    @IsString()
    @IsNotEmpty()
    saleOrderCode!: string;

    @IsString()
    @IsNotEmpty()
    sourceGeographicalKey!: string;

    @IsString()
    @IsNotEmpty()
    destinationGeographicalKey!: string;

    @IsString()
    @IsNotEmpty()
    regionCode!: string;

    @IsArray()
    @IsNotEmpty()
    @Type(() => CreateSaleOrderItemPayload)
    items!: CreateSaleOrderItemPayload[];    
}