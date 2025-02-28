import { Body, Controller, Post, Put } from "@nestjs/common";
import { BusinessPatnersModuleSubscriber } from "../solace-integration/business-partners.module.subscriber";
import { ApiTags } from "@nestjs/swagger";
import { BusinessPartnersModuleOptions } from "../business-partners.module.options";
import { SolacePublisher } from "@src/building-blocks/infra/solace";
import { faker } from "@faker-js/faker";

@ApiTags("Business-Partners")
@Controller("/business-partners/solace")
export class BusinessPartnersSolaceController {

    constructor(
        private readonly businessPartnersSolaceSubscriber: BusinessPatnersModuleSubscriber,
        private readonly solacePublisher: SolacePublisher,
        private readonly options: BusinessPartnersModuleOptions
    ) { }

    @Put("/switch-to-replay")
    public Stop(): void {
        this.businessPartnersSolaceSubscriber.startReplayMode();
    }

    @Put("/switch-to-live")
    public Start(): void {
        this.businessPartnersSolaceSubscriber.startLiveMode();
    }

    @Put("/publish")
    public Publish(): void {
        this.solacePublisher.PublishQueue(this.options.businessPartnerSolaceQueueName, { "a": faker.person.fullName() });
    }
} 