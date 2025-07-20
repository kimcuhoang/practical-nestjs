import { Type } from "class-transformer";
import { IsArray, Min, ValidateNested } from "class-validator";

export class CreateSaleOrderItemPayload
{
    productKey!: string;

    @Min(1)
    quantity!: number;
}

export class CreateSaleOrderPayload
{
    saleOrderCode!: string;
    sourceGeographicalKey!: string;
    destinationGeographicalKey!: string;
    regionCode!: string;

    @ValidateNested({ each: true })
    @Type(() => CreateSaleOrderItemPayload)
    items!: CreateSaleOrderItemPayload[];    
}