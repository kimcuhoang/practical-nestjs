import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizUnit } from "@src/w-hra-modules/shipments/domain";
import { CreateBizUnitPayload, CreateBizUnitRegionPayload, CreateBizUnitSettingsPayload } from "@src/w-hra-modules/shipments/use-cases/commands";
import { BizUnitsControllers } from "@src/w-hra-planning/controllers/biz-units.controller";
import { app, request, TestHelpers } from "@test/test.setup";
import { Equal, Repository } from "typeorm";


describe(`Create ${BizUnit.name} via ${BizUnitsControllers.name}`, () => {
    let bizUnitRepository: Repository<BizUnit>;

    beforeAll(() => {
        bizUnitRepository = app.get(getRepositoryToken(BizUnit));
    });

    afterEach(async() => {
        await bizUnitRepository.delete({});
    });

    test(`should be success`, async() => {
        const payload = {
            bizUnitCode: TestHelpers.genCode(),
            settings: {
                countryCode: faker.location.countryCode(),
                timeZone: "GMT+9"
            } satisfies CreateBizUnitSettingsPayload,
            regions: [
                {
                    regionCode: "ES"
                } satisfies CreateBizUnitRegionPayload
            ]
        } satisfies CreateBizUnitPayload;

        console.log(JSON.stringify(payload));

        const response = await request
                .post("/biz-units")
                .send(payload)
                .expect(HttpStatus.CREATED);

        const bizUnitId = response.text;
        expect(bizUnitId).toBeTruthy();

        const bizUnit = await bizUnitRepository.findOne({
            where: { 
                id: Equal(bizUnitId)
            },
            relations: {
                regions: true
            }
        });

        expect(bizUnit).toBeTruthy();
        expect(bizUnit.bizUnitCode).toBe(payload.bizUnitCode);
        expect(bizUnit.settings.countryCode).toBe(payload.settings.countryCode);
        expect(bizUnit.settings.timeZone).toBe(payload.settings.timeZone);
        expect(bizUnit.regions).toHaveLength(payload.regions.length);

        for(const region of bizUnit.regions) {
            const payloadRegion = payload.regions.find(r => r.regionCode === region.regionCode);
            expect(payloadRegion).toBeTruthy();
        }
    });
});