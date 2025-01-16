import { Controller, Put } from "@nestjs/common";
import { BusinessPatnersModuleSubscriber } from "../solace-integration/business-partners.module.subscriber";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Business-Partners")
@Controller("/business-partners/solace")
export class BusinessPartnersSolaceController {

    constructor(
        private readonly businessPartnersSolaceSubscriber: BusinessPatnersModuleSubscriber
    ) { }

    @Put("/switch-to-replay")
    public async Stop(): Promise<void> {
        await this.businessPartnersSolaceSubscriber.startReplayMode();
    }

    @Put("/switch-to-live")
    public async Start(): Promise<void> {
        await this.businessPartnersSolaceSubscriber.startLiveMode();
    }
} 