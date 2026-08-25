import { HttpStatus } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizUnit } from "@src/w-hra-modules/biz-units/domain";
import { GetBizUnitQuery } from "@src/w-hra-modules/biz-units/use-cases/queries";
import { BizUnitsControllers } from "@src/w-hra-planning/controllers/biz-units.controller";
import { app, request } from "@test/test.setup";
import { Repository } from "typeorm";


describe(`Get ${BizUnit.name} via ${BizUnitsControllers.name}`, () => {
    let bizUnitRepository: Repository<BizUnit>;
    let queryBus: QueryBus;

    const bizUnit = new BizUnit({
        bizUnitCode: "TEST",
        commonSettings: {
            countryCode: "JP",
            timeZone: "GMT+9"
        },
        shipmentKeySettings: {
            prefix: "SK",
            sequenceStart: "00001",
            sequenceEnd: "99999",
        },
        shipmentLaneKeySettings: {
            prefix: "SLK",
            template: "####"
        }
    });
    bizUnit.addBizUnitRegion("VN");

    beforeAll(async () => {
        bizUnitRepository = app.get(getRepositoryToken(BizUnit));
        queryBus = app.get(QueryBus);
        await bizUnitRepository.save(bizUnit);
    });

    afterAll(async () => {
        await bizUnitRepository.delete({});
    });

    test(`data should be setup correctly`, async() => {
        const savedBizUnit = await bizUnitRepository.findOneOrFail({
            where: { id: bizUnit.id },
            relations: {
                regions: true,
                commonSettings: true,
                shipmentKeySettings: true,
                shipmentLaneKeySettings: true,
            }
        });
        expect(savedBizUnit).toBeTruthy();
    });

    test(`should query sucessfully`, async() => {
        const result = await queryBus.execute(new GetBizUnitQuery(bizUnit.id));
        expect(result).toBeTruthy();
        expect(result.bizUnitCode).toBe(bizUnit.bizUnitCode);
    });

    test(`1st time, query should be success from database`, async() => {
        const response = await request.get(`/biz-units/${bizUnit.id}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual(expect.objectContaining({
            id: bizUnit.id,
            bizUnitCode: bizUnit.bizUnitCode,
        }));
    });

    test(`2nd time, query should be success from cache`, async() => {
        const mockOfQueryBusExecute = jest.spyOn(queryBus, "execute");

        const response = await request.get(`/biz-units/${bizUnit.id}`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual(expect.objectContaining({
            id: bizUnit.id,
            bizUnitCode: bizUnit.bizUnitCode,
        }));

        expect(mockOfQueryBusExecute).not.toHaveBeenCalled();
        mockOfQueryBusExecute.mockRestore();
    });
})