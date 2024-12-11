import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectsModuleSettings {
    projectsSolaceQueueName: string;
    enabledSubscribe: boolean;
    enabledReplay: boolean;
    startReplayFromDatetime: Date | null;
    startReplayFromLastMessageId: string | null;

    constructor(settings: Partial<ProjectsModuleSettings>) {
        Object.assign(this, settings);
    }
}