import { Body, Controller, Post, Put } from "@nestjs/common";
import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { ProjectsModuleSubscriber } from "../solace-integration/projects.module.subscriber";
import { SolacePublisher } from "@src/building-blocks/infra/solace";
import { ProjectsModuleSettings } from "../projects.module.settings";
import { faker } from "@faker-js/faker";
import { CreateProjectPayload, CreateProjectTaskPayload } from "../use-cases";

@ApiTags("Projects Management")
@Controller("/projects/solace")
export class ProjectsSolaceController {
    constructor(
        private readonly projectsModulerSubscriber: ProjectsModuleSubscriber,
        private readonly solacePublisher: SolacePublisher,
        private readonly options: ProjectsModuleSettings
    ){}

    @Put("/v1/switch-to-replay")
    public Stopv1(): void {
        this.projectsModulerSubscriber.switchToReplay();
    }

    @Put("/v1/switch-to-live")
    public Startv2(): void {
        this.projectsModulerSubscriber.switchToLiveMode();
    }

    @Put("/publish")
    public Publish(): void {
        this.solacePublisher.PublishQueue(this.options.projectsSolaceQueueName, new CreateProjectPayload({
            projectName: faker.lorem.sentence(5),
            tasks: [
                new CreateProjectTaskPayload({ taskName: faker.lorem.sentence(5) }),
                new CreateProjectTaskPayload({ taskName: faker.lorem.sentence(5) })
            ]
        }));
    }
}