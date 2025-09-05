import { CommandBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateBizUnitHandler } from "@src/w-hra-modules/biz-units/use-cases/commands/create/create-biz-unit.handler";
import { Repository } from "typeorm";
import { faker } from "@faker-js/faker";
import { BizUnit, CommonSettings } from "@src/w-hra-modules/biz-units/domain";
import { CreateBizUnitRegionPayload, CreateBizUnitPayload, CreateBizUnitCommand } from "@src/w-hra-modules/biz-units/use-cases/commands";
import { app, TestHelpers } from "@test/test.setup";

describe(`Create ${BizUnit.name} via ${CreateBizUnitHandler.name}`, () => {
    let bizUnitRepository: Repository<BizUnit>;
    let commandBus: CommandBus;

    beforeAll(() => {
        bizUnitRepository = app.get(getRepositoryToken(BizUnit));
        commandBus = global.commandBus;
    });

    afterEach(async () => {
        await bizUnitRepository.delete({});
    });

    test(`should be success`, async () => {
        const payload = {
            bizUnitCode: TestHelpers.genCode(),
            commonSettings: {
                countryCode: "VN",
                timeZone: "GMT+7",
            } satisfies CommonSettings,
            shipmentKeySettings: {
                prefix: "SK",
                sequenceStart: "00001",
                sequenceEnd: "99999",
            },
            regions: faker.helpers.multiple(() => ({
                regionCode: TestHelpers.genCode(2),
            }) satisfies CreateBizUnitRegionPayload, { count: 3 }),
        } satisfies CreateBizUnitPayload;

        const bizUnitId = await commandBus.execute(new CreateBizUnitCommand(payload));
        expect(bizUnitId).toBeTruthy();

        const bizUnit = await bizUnitRepository.findOne({
            where: { id: bizUnitId },
            relations: {
                regions: true,
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
    });
});