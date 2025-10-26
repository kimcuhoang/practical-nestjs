import { Logger } from "@nestjs/common";
import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { BizPartnerCommunicationType } from "@src/w-hra-modules/biz-partners/domain";
import { BizPartnerCreated } from "@src/w-hra-modules/biz-partners/integration-events";
import { CustomerCommunicationType } from "@src/w-hra-modules/customers/domain";
import { CreateCustomerCommand, CustomerCommunicationPayload, CustomerPayload } from "@src/w-hra-modules/customers/use-cases/commands";

@EventsHandler(BizPartnerCreated)
export class BizPartnerCreatedHandler implements IEventHandler<BizPartnerCreated> {

    private readonly logger = new Logger(BizPartnerCreatedHandler.name);

    constructor(
        private readonly commandBus: CommandBus
    ){}

    public async handle(event: BizPartnerCreated): Promise<void> {

        const payload = new CustomerPayload();
        payload.name = event.bizPartner.name;
        payload.code = event.bizPartner.customer.code;
        payload.communications = event.bizPartner.communications.map(c => ({
            value: c.value,
            type: c.communicationType === BizPartnerCommunicationType.Mail 
                    ? CustomerCommunicationType.Mail 
                    : CustomerCommunicationType.Phone,
            
        }) as CustomerCommunicationPayload);

        const customerId = await this.commandBus.execute(new CreateCustomerCommand(payload));
        this.logger.log(`New customer created with id: ${customerId}`);

    }
}