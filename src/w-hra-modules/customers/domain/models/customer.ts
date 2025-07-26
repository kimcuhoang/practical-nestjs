import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { CustomerCommunication } from "./customer-communication";
import { Type } from "class-transformer";


export class Customer extends EntityBase {
    name!: string;
    code!: string;

    @Type(() => CustomerCommunication)
    communications!: CustomerCommunication[];

    constructor(config?: (customer: Customer) => void) {
        super();
        config?.(this);
    }

    public addCommunication(config: (communication: CustomerCommunication) => void): Customer {
        const communication = new CustomerCommunication(this);
        config(communication);
        
        if (!this.communications?.length) {
            this.communications = [];
        }
        this.communications.push(communication);
        return this;
    }
}