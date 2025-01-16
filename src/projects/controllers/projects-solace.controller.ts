import { Controller, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProjectsModuleSubscriber } from "../solace-integration/projects.module.subscriber";

@ApiTags("Solaces")
@Controller("/projects/solace")
export class ProjectsSolaceController {
    constructor(
        private readonly projectsModulerSubscriber: ProjectsModuleSubscriber,
    ){}

    @Put("/switch-to-replay")
    public async Stop(): Promise<void> {
        await this.projectsModulerSubscriber.startReplayMode();
    }

    @Put("/switch-to-live")
    public async Start(): Promise<void> {
        await this.projectsModulerSubscriber.startLiveMode();
    }
}