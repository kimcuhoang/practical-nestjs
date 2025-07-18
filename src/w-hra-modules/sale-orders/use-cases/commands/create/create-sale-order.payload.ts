import { Type } from "class-transformer";
import { Min } from "class-validator";

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

    @Type(() => CreateSaleOrderItemPayload)
    items!: CreateSaleOrderItemPayload[];    
}