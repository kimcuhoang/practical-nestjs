import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ProjectsModuleSubscriber } from "./projects.module.subscriber";


@Injectable()
export class ProjectsModuleSubscriberTask implements OnApplicationBootstrap {

    constructor(
        private readonly projectModuleSubscriber: ProjectsModuleSubscriber
    ) { }

    public async onApplicationBootstrap(): Promise<void> {
        await this.projectModuleSubscriber.startLiveMode();
    }
}