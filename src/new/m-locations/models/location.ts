import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { ulid } from "ulidx";

export enum LocationUnit {
    Warehouse = "Warehouse",
    Customer = "Customer"
}

export class Location extends EntityBase {
    constructor(){
        super(ulid());
    }

    name!: string;
    unit!: LocationUnit;
}