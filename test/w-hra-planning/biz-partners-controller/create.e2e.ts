import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizPartner, BizPartnerCommunicationType, BizPartnerGroup, BizPartnerRole } from "@src/w-hra-modules/biz-partners/domain";
import { BizPartnerCommunicationPayload, BizPartnerCustomerPayload, BizPartnerPayload, BizPartnerVendorPayload } from "@src/w-hra-modules/biz-partners/use-cases/commands";
import { BizPartnersController } from "@src/w-hra-planning/controllers/biz-partners.controller";
import { app, request, TestHelpers } from "@test/test.setup";
import { Repository } from "typeorm";

describe(`Create ${BizPartner.name} via ${BizPartnersController.name}`, () => {
    let bizPartnerRepository: Repository<BizPartner>;

    beforeAll(() => {
        bizPartnerRepository = app.get(getRepositoryToken(BizPartner));
    });

    afterEach(async() => {
        await bizPartnerRepository.delete({});
    });

    test(`should be success`, async() => {
        const payload = {
            group: faker.helpers.enumValue(BizPartnerGroup),
            role: faker.helpers.enumValue(BizPartnerRole),
            name: faker.company.name(),
            customer: {
                code: TestHelpers.genCode(),
                regions: faker.helpers.multiple(() => TestHelpers.genCode(2) , { count: 3 })
            } satisfies BizPartnerCustomerPayload,
            vendor: {
                code: TestHelpers.genCode(),
                shipmentVendorFlag: faker.datatype.boolean(),
                regions: faker.helpers.multiple(() => TestHelpers.genCode(2) , { count: 3 })
            } satisfies BizPartnerVendorPayload,
            communications: faker.helpers.multiple(() => ({ 
                communicationType: faker.helpers.enumValue(BizPartnerCommunicationType),
                value: faker.internet.email(),
            } satisfies BizPartnerCommunicationPayload ), { count: 3 }),
        } satisfies BizPartnerPayload;

        console.log(JSON.stringify(payload, null, 2));

        const response = await request
            .post("/biz-partners")
            .send(payload)
            .expect(HttpStatus.CREATED);

        const bizPartnerId = response.text;
        expect(bizPartnerId).toBeTruthy();

        const bizPartner = await bizPartnerRepository.findOne({
            where: { id: bizPartnerId },
            relations: {
                customer: {
                    regions: true
                },
                vendor: {
                    regions: true
                },
                communications: true
            }
        });
        expect(bizPartner).toBeTruthy();
        expect(bizPartner.group).toBe(payload.group);
        expect(bizPartner.role).toBe(payload.role);
        expect(bizPartner.name).toBe(payload.name);

        expect(bizPartner.customer.code).toBe(payload.customer.code);
        expect(bizPartner.customer.regions.length).toBe(payload.customer.regions.length);
        bizPartner.customer.regions.forEach(r => {
            const region = payload.customer.regions.find(p => p === r.region);
            expect(region).toBeTruthy();
        })

        expect(bizPartner.vendor.code).toBe(payload.vendor.code);
        expect(bizPartner.vendor.shipmentVendorFlag).toBe(payload.vendor.shipmentVendorFlag);
        expect(bizPartner.vendor.regions.length).toBe(payload.vendor.regions.length);
        bizPartner.vendor.regions.forEach(r => {
            const region = payload.vendor.regions.find(p => p === r.region);
            expect(region).toBeTruthy();
        });

        expect(bizPartner.communications.length).toBe(payload.communications.length);
        bizPartner.communications.forEach(c => {
            const communication = payload.communications.find(p => p.value === c.value && p.communicationType === c.communicationType);
            expect(communication).toBeTruthy();
        });
    });
});