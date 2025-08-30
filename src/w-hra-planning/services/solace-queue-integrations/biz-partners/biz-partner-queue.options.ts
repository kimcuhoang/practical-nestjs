import { Injectable } from "@nestjs/common";
import { SubscriptionInstanceOptions } from "@src/infra-modules/solace-queue/instances/subscription-instance.options";


@Injectable()
export class BizPartnerSolaceQueueOptions extends SubscriptionInstanceOptions {
    constructor(options: Partial<BizPartnerSolaceQueueOptions>) {
        super();
        Object.assign(this, options);
    }
}