import { Injectable } from "@nestjs/common";


@Injectable()
export class BusinessPartnersModuleOptions {
    businessPartnerSolaceQueueName: string;

    constructor(options: Partial<BusinessPartnersModuleOptions>){
        Object.assign(this, options);
    }
}
