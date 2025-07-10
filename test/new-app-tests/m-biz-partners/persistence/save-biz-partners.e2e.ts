import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizPartner } from "@src/new/m-biz-partners/models";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";


describe('Save Biz Partners E2E Tests', () => {
    let bizPartnerRepository: Repository<BizPartner>;

    beforeAll(() => {
        bizPartnerRepository = app.get(getRepositoryToken(BizPartner));
    });

    test('should save a new Biz Partner', async () => {
        const newBizPartner = new BizPartner();
        newBizPartner.bizPartnerKey = faker.string.alphanumeric(10).toUpperCase();
        newBizPartner.name = faker.company.name();

        var savedResult = await bizPartnerRepository.save(newBizPartner);

        var foundBizPartner = await bizPartnerRepository.findOne({
            where: { id: savedResult.id }
        });

        expect(foundBizPartner).toBeTruthy();
    });

});