import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectsModuleSettings {
    projectsSolaceQueueName: string;
    topicCRT: string;
    topicUPD: string;
    topicCNL: string;
    enabledSubscribe: boolean;
    enabledSubscribeTopics: boolean;

    constructor(settings: Partial<ProjectsModuleSettings>) {
        Object.assign(this, settings);
    }

    public getTopics(): string[] {
        const topics: string[] = [];
        this.topicCRT && topics.push(this.topicCRT);
        this.topicUPD && topics.push(this.topicUPD);
        this.topicCNL && topics.push(this.topicCNL);
        return topics;
    }
}