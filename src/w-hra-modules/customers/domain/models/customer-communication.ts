import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { Type } from "class-transformer";
import { Customer } from "./customer";

export enum CustomerCommunicationType {
    Mail = "Mail",
    Phone = "Phone"
}

export class CustomerCommunication extends EntityBase {
    readonly customerId!: string;

    @Type(() => Customer)
    customer!: Customer;

    type!: CustomerCommunicationType;
    value!: string;

    constructor(customer?: Customer) {
        super();
        if (customer) {
            this.customer = customer;
            this.customerId = customer.id;
        }
    }
}