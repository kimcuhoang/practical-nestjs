import { Injectable } from "@nestjs/common";

@Injectable()
export class SaleOrderQueueOptions {
    enabledSubscribeFromQueue: boolean;
    enabledRecordMessage: boolean;
    enabledRecordInvalidMessage: boolean;
    enabledSubscribeFromTopics: boolean;

    queueName: string;
    topicTemplates: string[] = [];
    topicActions: string[] = [];

    constructor(options: Partial<SaleOrderQueueOptions>) {
        Object.assign(this, options);
    }
}