import * as stringUtil from "util";

export abstract class SubscriptionInstanceOptions {
    enabledRecordMessage: boolean;
    enabledRecordInvalidMessage: boolean;

    enabledSubscribeFromQueue: boolean;
    enabledSubscribeFromTopics: boolean;

    queueName: string;
    topicTemplates: string[] = [];
    topicActions: string[] = [];

    public getTopics(): string[] {
        return !this.enabledSubscribeFromTopics
                ? []
                : this.topicActions?.flatMap(action => {
                    return this.topicTemplates.map(template => stringUtil.format(template.trim(), action.trim()));
                });
    }
}