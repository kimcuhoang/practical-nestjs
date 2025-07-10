import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizPartner } from "@src/new/m-biz-partners/models";
import { BizPartnerCommunication, BizPartnerCommunicationType } from "@src/new/m-biz-partners/models/biz-partner-communication";
import { BizPartnerLocation } from "@src/new/m-biz-partners/models/biz-partner-location";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";


describe('Save Biz Partners E2E Tests', () => {
    let bizPartnerRepository: Repository<BizPartner>;
    let bizPartnerLocationRepository: Repository<BizPartnerLocation>;
    let bizPartnerCommunicationRepository: Repository<BizPartnerCommunication>;

    const newBizPartner = new BizPartner();

    beforeAll(() => {
        bizPartnerRepository = app.get(getRepositoryToken(BizPartner));
        bizPartnerLocationRepository = app.get(getRepositoryToken(BizPartnerLocation));
        bizPartnerCommunicationRepository = app.get(getRepositoryToken(BizPartnerCommunication));
    });

    afterEach(async () => {
        const deletedResult = await bizPartnerRepository.delete({
            id: newBizPartner.id
        });

        expect(deletedResult.affected).toBe(1);

        const bizPartnerLocations = await bizPartnerLocationRepository.find({
            where: { bizPartnerId: newBizPartner.id }
        });
        expect(bizPartnerLocations).toHaveLength(0);

        const bizPartnerCommunications = await bizPartnerCommunicationRepository.find({
            where: { bizPartnerId: newBizPartner.id }
        });
        expect(bizPartnerCommunications).toHaveLength(0);
    });

    test('should save a new Biz Partner', async () => {
        newBizPartner.bizPartnerKey = faker.string.alphanumeric(10).toUpperCase();
        newBizPartner.name = faker.company.name();

        var savedResult = await bizPartnerRepository.save(newBizPartner);

        var foundBizPartner = await bizPartnerRepository.findOne({
            where: { id: savedResult.id },
            relations: {
                locations: true,
                communications: true
            }
        });

        expect(foundBizPartner).toBeTruthy();
        expect(foundBizPartner.locations).toHaveLength(newBizPartner.locations.length);
        expect(foundBizPartner.communications).toHaveLength(newBizPartner.communications.length);
    });

    test("should save a new Biz Partner with locations", async () => {
        newBizPartner.bizPartnerKey = faker.string.alphanumeric(10).toUpperCase();
        newBizPartner.name = faker.company.name();
        
        newBizPartner.addLocation({
            locationKey: faker.string.alphanumeric(10).toUpperCase(),
            address: faker.location.streetAddress()
        });

        newBizPartner.addLocation({
            locationKey: faker.string.alphanumeric(10).toUpperCase(),
            address: faker.location.streetAddress()
        });

        var savedResult = await bizPartnerRepository.save(newBizPartner);

        var foundBizPartner = await bizPartnerRepository.findOne({
            where: { id: savedResult.id },
            relations: {
                locations: true
            }
        });

        expect(foundBizPartner).toBeTruthy();
        expect(foundBizPartner.locations).toHaveLength(newBizPartner.locations.length);
    });

    test("should save a new Biz Partner with communications", async () => {
        newBizPartner.bizPartnerKey = faker.string.alphanumeric(10).toUpperCase();
        newBizPartner.name = faker.company.name();

        newBizPartner.addCommunication({
            communicationType: BizPartnerCommunicationType.Email,
            value: faker.internet.email()
        });

        newBizPartner.addCommunication({
            communicationType: BizPartnerCommunicationType.Phone,
            value: faker.phone.number()
        });

        var savedResult = await bizPartnerRepository.save(newBizPartner);

        var foundBizPartner = await bizPartnerRepository.findOne({
            where: { id: savedResult.id },
            relations: {
                communications: true
            }
        });

        expect(foundBizPartner).toBeTruthy();
        expect(foundBizPartner.communications).toHaveLength(newBizPartner.communications.length);
    });

});