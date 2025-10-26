import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizUnit } from "@src/w-hra-modules/biz-units/domain";
import { CommonSettingsDto, CreateBizUnitRegionPayload, CreateBizUnitPayload } from "@src/w-hra-modules/biz-units/use-cases/commands";
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
            commonSettings: {
                countryCode: faker.location.countryCode(),
                timeZone: "GMT+9"
            } satisfies CommonSettingsDto,
            shipmentKeySettings: {
                prefix: "SK",
                sequenceStart: "00001",
                sequenceEnd: "99999",
            },
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

        expect(bizUnit.commonSettings.countryCode).toBe(payload.commonSettings.countryCode);
        expect(bizUnit.commonSettings.timeZone).toBe(payload.commonSettings.timeZone);

        expect(bizUnit.shipmentKeySettings.prefix).toBe(payload.shipmentKeySettings.prefix);
        expect(bizUnit.shipmentKeySettings.sequenceStart).toBe(payload.shipmentKeySettings.sequenceStart);
        expect(bizUnit.shipmentKeySettings.sequenceEnd).toBe(payload.shipmentKeySettings.sequenceEnd);

        expect(bizUnit.regions).toHaveLength(payload.regions.length);

        for(const region of bizUnit.regions) {
            const payloadRegion = payload.regions.find(r => r.regionCode === region.regionCode);
            expect(payloadRegion).toBeTruthy();
        }
    });
});