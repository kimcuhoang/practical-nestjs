import { CommandBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizUnit, BizUnitSettings } from "@src/w-hra-modules/shipments/domain";
import { CreateBizUnitCommand, CreateBizUnitPayload, CreateBizUnitRegionPayload } from "@src/w-hra-modules/shipments/use-cases/commands";
import { CreateBizUnitHandler } from "@src/w-hra-modules/shipments/use-cases/commands/biz-units/create/create-biz-unit.handler";
import { app, TestHelpers } from "@test/test.setup";
import { Repository } from "typeorm";
import { faker } from "@faker-js/faker";

describe(`Create ${BizUnit.name} via ${CreateBizUnitHandler.name}`, () => {
    let bizUnitRepository: Repository<BizUnit>;
    let commandBus: CommandBus;

    beforeAll(() => {
        bizUnitRepository = app.get(getRepositoryToken(BizUnit));
        commandBus = app.get(CommandBus);
    });

    afterEach(async () => {
        await bizUnitRepository.delete({});
    });

    test(`should be success`, async () => {
        const payload = {
            bizUnitCode: TestHelpers.genCode(),
            settings: {
                countryCode: "VN",
                timeZone: "GMT+7",
            } satisfies BizUnitSettings,
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
        expect(bizUnit.settings.countryCode).toBe(payload.settings.countryCode);
        expect(bizUnit.settings.timeZone).toBe(payload.settings.timeZone);
        expect(bizUnit.regions).toHaveLength(payload.regions.length);
        
    });
});