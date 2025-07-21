import { Injectable } from "@nestjs/common";
import { SubscriptionInstanceOptions } from "@src/w-hra-modules/solace-queue/instances/subscription-instance.options";

@Injectable()
export class ShipmentsQueueOptions extends SubscriptionInstanceOptions {
    constructor(options: Partial<ShipmentsQueueOptions>) {
        super();
        Object.assign(this, options);
    }
}