import { Injectable } from "@nestjs/common";


@Injectable()
export class BusinessPartnersModuleOptions {
    businessPartnerSolaceQueueName: string;
    enabledSubscribeTopics: boolean;
    topicCRT: string;

    constructor(options: Partial<BusinessPartnersModuleOptions>){
        Object.assign(this, options);
    }

    public getTopics(): string[] {
        const topics: string[] = [];
        this.topicCRT && topics.push(this.topicCRT);
        return topics;
    }
}
