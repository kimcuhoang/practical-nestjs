import { Injectable } from "@nestjs/common";
import { SubscriptionInstanceOptions } from "@src/infra-modules/solace-queue/instances/subscription-instance.options";


@Injectable()
export class SaleOrderQueueOptions extends SubscriptionInstanceOptions {
    
    constructor(options: Partial<SaleOrderQueueOptions>) {
        super();
        Object.assign(this, options);
    }
}