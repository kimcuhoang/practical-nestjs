import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectsModuleSettings {
    projectsSolaceQueueName: string;
    enabledSubscribe: boolean;
    enabledReplay: boolean;
    startReplayFromDatetime: Date;

    constructor(settings: Partial<ProjectsModuleSettings>) {
        Object.assign(this, settings);
    }
}