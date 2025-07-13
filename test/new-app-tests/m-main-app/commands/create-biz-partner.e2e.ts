import { faker } from "@faker-js/faker";
import { CommandBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizPartner } from "@src/new/m-biz-partners/models";
import { CreateBizPartnerCommand, CreateBizPartnerLocationPayload, CreateBizPartnerPayload } from "@src/new/m-biz-partners/usecases/commands/create-biz-partner/create-biz-partner.command";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";


describe(`Create ${BizPartner.name} via command`, () => {
    let bizPartnerRepository: Repository<BizPartner>;
    let commandBus: CommandBus;

    beforeAll(() => {
        bizPartnerRepository = app.get(getRepositoryToken(BizPartner));
        commandBus = app.get(CommandBus);
    })

    afterEach(async() => {
        await bizPartnerRepository.delete({});
    })

    test(`should be success`, async() => {
        const payload  = {
            bizPartnerKey: faker.string.alphanumeric(10).toUpperCase(),
            name: faker.company.name(),
            locations: faker.helpers.multiple(() => {
                return {
                    locationKey: faker.string.alphanumeric(10).toUpperCase(),
                    address: faker.location.streetAddress({ useFullAddress: true })
                } satisfies CreateBizPartnerLocationPayload
            }, { count: 4 })
        } satisfies CreateBizPartnerPayload;

        const bizPartnerId = await commandBus.execute(new CreateBizPartnerCommand(payload));
        expect(bizPartnerId).toBeTruthy();

        const bizPartner = await bizPartnerRepository.findOne({
            where: { id: bizPartnerId },
            relations: {
                locations: true
            }
        });
        expect(bizPartner).toBeTruthy();
        expect(bizPartner.name).toBe(payload.name);
        expect(bizPartner.bizPartnerKey).toBe(payload.bizPartnerKey);
        expect(bizPartner.locations).toHaveLength(payload.locations.length);

    });
});