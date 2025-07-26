import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizPartner, BizPartnerCommunication, BizPartnerCommunicationType, BizPartnerCustomer, BizPartnerGroup, BizPartnerRole, BizPartnerVendor } from "@src/w-hra-modules/biz-partners/domain";
import { BizPartnerCustomerRegion } from "@src/w-hra-modules/biz-partners/domain/models/biz-partner-customer-region";
import { BizPartnerVendorRegion } from "@src/w-hra-modules/biz-partners/domain/models/biz-partner-vendor-region";
import { app, TestHelpers } from "@test/test.setup";
import { Equal, Repository } from "typeorm";


describe(`Create ${BizPartner.name}`, () => {
    let bizPartnerRepository: Repository<BizPartner>;
    let bizPartnerCommunicationRepository: Repository<BizPartnerCommunication>;
    let bizPartnerCustomerRepository: Repository<BizPartnerCustomer>;
    let bizPartnerCustomerRegionRepository: Repository<BizPartnerCustomerRegion>;
    let bizPartnerVendorRepository: Repository<BizPartnerVendor>;
    let bizPartnerVendorRegionRepository: Repository<BizPartnerVendorRegion>;


    const bizPartner = new BizPartner(b => {
        b.name = faker.company.name(),
        b.group = faker.helpers.enumValue(BizPartnerGroup),
        b.role = faker.helpers.enumValue(BizPartnerRole)
    });

    beforeAll(() => {
        bizPartnerRepository = app.get(getRepositoryToken(BizPartner));
        bizPartnerCustomerRepository = app.get(getRepositoryToken(BizPartnerCustomer));
        bizPartnerCustomerRegionRepository = app.get(getRepositoryToken(BizPartnerCustomerRegion));
        bizPartnerCommunicationRepository = app.get(getRepositoryToken(BizPartnerCommunication));
        bizPartnerVendorRepository = app.get(getRepositoryToken(BizPartnerVendor));
        bizPartnerVendorRegionRepository = app.get(getRepositoryToken(BizPartnerVendorRegion));
    });

    afterEach(async() => {
        await bizPartnerRepository.delete({});

        const communications = await bizPartnerCommunicationRepository.find();
        expect(communications).toHaveLength(0);

        const customers = await bizPartnerCustomerRepository.find();
        expect(customers).toHaveLength(0);

        const customerRegions = await bizPartnerCustomerRegionRepository.find();
        expect(customerRegions).toHaveLength(0);

        const vendors = await bizPartnerVendorRepository.find();
        expect(vendors).toHaveLength(0);

        const vendorRegions = await bizPartnerVendorRegionRepository.find();
        expect(vendorRegions).toHaveLength(0);
    });

    test(`without navigations should be success`, async() => {
        
        const savedResult = await bizPartnerRepository.save(bizPartner);
        expect(savedResult.id).toBe(bizPartner.id);

        const savedBizPartner = await bizPartnerRepository.findOne({
            where: {
                id: Equal(bizPartner.id)
            }
        });

        expect(savedBizPartner).toBeTruthy();
        expect(savedBizPartner.name).toBe(bizPartner.name);
        expect(savedBizPartner.group).toBe(bizPartner.group);
        expect(savedBizPartner.role).toBe(bizPartner.role);

    });

    test(`with ${BizPartnerCustomer.name} should be success`, async() => {
        bizPartner.constructCustomer(customer => {
            customer.code = TestHelpers.genCode(),
            customer
                .assignToRegion(TestHelpers.genCode(2))
                .assignToRegion(TestHelpers.genCode(2))
        });

        const savedResult = await bizPartnerRepository.save(bizPartner);
        expect(savedResult.id).toBe(bizPartner.id);

        const savedBizPartner = await bizPartnerRepository.findOne({
            where: {
                id: Equal(bizPartner.id)
            },
            relations: {
                customer: {
                    regions: true
                }
            }
        });

        expect(savedBizPartner).toBeTruthy();

        const seedingCustomer = bizPartner.customer;
        const customer = savedBizPartner.customer;

        expect(customer).toBeTruthy();
        expect(customer.code).toBe(seedingCustomer.code);
        expect(customer.regions).toHaveLength(seedingCustomer.regions.length);

        customer.regions.forEach(r => {
            const region = seedingCustomer.regions.find(_ => _.region === r.region);
            expect(region).toBeTruthy();
        });
        
    });

    test(`with ${BizPartnerVendor.name} should be success`, async() => {
        bizPartner.constructVendor(vendor => {
            vendor.code = TestHelpers.genCode(),
            vendor.shipmentVendorFlag = true,
            vendor
                .assignToRegion(TestHelpers.genCode(5))
                .assignToRegion(TestHelpers.genCode(5));
        });

        const savedResult = await bizPartnerRepository.save(bizPartner);
        expect(savedResult.id).toBe(bizPartner.id);

        const savedBizPartner = await bizPartnerRepository.findOne({
            where: {
                id: Equal(bizPartner.id)
            },
            relations: {
                vendor: {
                    regions: true
                }
            }
        });

        expect(savedBizPartner).toBeTruthy();

        const vendor = savedBizPartner.vendor;
        const seedingVendor = bizPartner.vendor;

        expect(vendor).toBeTruthy();
        expect(vendor.code).toBe(seedingVendor.code);
        expect(vendor.shipmentVendorFlag).toBe(seedingVendor.shipmentVendorFlag);
        expect(vendor.regions).toHaveLength(seedingVendor.regions.length);

        vendor.regions.forEach(r => {
            const origin = seedingVendor.regions.find(_ => _.region === r.region);
            expect(origin).toBeTruthy();
        })
    });

    test(`with ${BizPartnerCommunication.name} should be success`, async() => {
        bizPartner.addCommunication(communication => {
            communication.communicationType = faker.helpers.enumValue(BizPartnerCommunicationType);
            communication.value = faker.phone.number();
        });

        const savedResult = await bizPartnerRepository.save(bizPartner);
        expect(savedResult.id).toBe(bizPartner.id);

        const savedBizPartner = await bizPartnerRepository.findOne({
            where: {
                id: Equal(bizPartner.id)
            },
            relations: {
                communications: true
            }
        });

        expect(savedBizPartner).toBeTruthy();

        const communications = savedBizPartner.communications;
        const seedingCommunications = bizPartner.communications;

        expect(communications).toHaveLength(seedingCommunications.length);
        communications.forEach(c => {
            const origin = seedingCommunications.find(_ => _.id === c.id);
            expect(origin).toBeTruthy();
            expect(origin.communicationType).toBe(c.communicationType);
            expect(origin.value).toBe(c.value);
        });

    });

    test(`with all navigations should be success`, async() => {
        bizPartner.constructCustomer(customer => {
            customer.code = TestHelpers.genCode(),
            customer
                .assignToRegion(TestHelpers.genCode(2))
                .assignToRegion(TestHelpers.genCode(2))
        });

        bizPartner.constructVendor(vendor => {
            vendor.code = TestHelpers.genCode(),
            vendor.shipmentVendorFlag = true,
            vendor
                .assignToRegion(TestHelpers.genCode(5))
                .assignToRegion(TestHelpers.genCode(5));
        });

        bizPartner.addCommunication(communication => {
            communication.communicationType = faker.helpers.enumValue(BizPartnerCommunicationType);
            communication.value = faker.phone.number();
        });

        const savedResult = await bizPartnerRepository.save(bizPartner);
        expect(savedResult.id).toBe(bizPartner.id);

        const savedBizPartner = await bizPartnerRepository.findOne({
            where: {
                id: Equal(bizPartner.id)
            },
            relations: {
                communications: true,
                customer: {
                    regions: true
                },
                vendor: {
                    regions: true
                }
            }
        });

        expect(savedBizPartner).toBeTruthy();
        expect(savedBizPartner.name).toBe(bizPartner.name);
        expect(savedBizPartner.group).toBe(bizPartner.group);
        expect(savedBizPartner.role).toBe(bizPartner.role);

        const seedingCustomer = bizPartner.customer;
        const customer = savedBizPartner.customer;

        expect(customer).toBeTruthy();
        expect(customer.code).toBe(seedingCustomer.code);
        expect(customer.regions).toHaveLength(seedingCustomer.regions.length);

        customer.regions.forEach(r => {
            const region = seedingCustomer.regions.find(_ => _.region === r.region);
            expect(region).toBeTruthy();
        });

        const vendor = savedBizPartner.vendor;
        const seedingVendor = bizPartner.vendor;

        expect(vendor).toBeTruthy();
        expect(vendor.code).toBe(seedingVendor.code);
        expect(vendor.shipmentVendorFlag).toBe(seedingVendor.shipmentVendorFlag);
        expect(vendor.regions).toHaveLength(seedingVendor.regions.length);

        vendor.regions.forEach(r => {
            const origin = seedingVendor.regions.find(_ => _.region === r.region);
            expect(origin).toBeTruthy();
        })

        const communications = savedBizPartner.communications;
        const seedingCommunications = bizPartner.communications;

        expect(communications).toHaveLength(seedingCommunications.length);
        communications.forEach(c => {
            const origin = seedingCommunications.find(_ => _.id === c.id);
            expect(origin).toBeTruthy();
            expect(origin.communicationType).toBe(c.communicationType);
            expect(origin.value).toBe(c.value);
        });

    });
});