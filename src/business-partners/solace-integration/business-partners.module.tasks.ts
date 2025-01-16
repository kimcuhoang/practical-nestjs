import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { BusinessPatnersModuleSubscriber } from "./business-partners.module.subscriber";

@Injectable()
export class BusinessPartnersModuleTasks implements OnApplicationBootstrap {

    constructor(
        private readonly businessPartnersModuleSubscriber: BusinessPatnersModuleSubscriber
    ) { }

    public async onApplicationBootstrap(): Promise<void> {
        await this.businessPartnersModuleSubscriber.startLiveMode();
    }
}