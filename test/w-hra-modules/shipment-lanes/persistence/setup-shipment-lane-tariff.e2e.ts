import { getEntityManagerToken, getRepositoryToken } from "@nestjs/typeorm";
import { BaseRateType, LaneRate, LaneRateValue, ShipmentLane, StopRate, StopRateValue, WeightRate, WeightRateValue } from "@src/w-hra-modules/shipment-lanes/domain";
import { IShipmentLaneKeySettingsService, SHIPMENT_LANE_KEY_SETTINGS_SERVICE } from "@src/w-hra-modules/shipment-lanes/services/shipment-lane-key-settings";
import { app, TestHelpers } from "@test/test.setup";
import { EntityManager, ILike, MoreThan, Repository } from "typeorm";


let shipmentLaneRepository: Repository<ShipmentLane>;
let entityManager: EntityManager;
let shipmentLaneKeySettingsService: IShipmentLaneKeySettingsService;

const spyInstances: jest.SpyInstance[] = [];
const codeTemplate = "#########";
const prefix = "SHIPMENT_LANE";

const shipmentLane = new ShipmentLane();

const tariff = shipmentLane.addTariff({
    bizPartnerCode: TestHelpers.genCode(),
    preferred: true
});

const tariffValidity = tariff.addValidity({
    validFrom: new Date("2024-01-01"),
    validTo: new Date("2024-12-31")
});

const laneRate = new LaneRate(tariffValidity);
const laneRateValue = new LaneRateValue(laneRate, {
    value: 5000
});

const weightRate = new WeightRate(tariffValidity);
const weightRateValue = new WeightRateValue(weightRate, {
    value: 100,
    perSegment: 10,
    segmentUnit: "kg"
});

const stopRate = new StopRate(tariffValidity);
const stopRateValue = new StopRateValue(stopRate, {
    value: 50,
    perNumberOfStops: 5
});

const allTariffs = shipmentLane.tariffs;
const allTariffValidities = allTariffs.flatMap(t => t.validities);
const allBaseRates = allTariffValidities.flatMap(v => v.baseRates);
const allBaseRateValues = allBaseRates.flatMap(br => br.values);

const allLaneRates = allBaseRates.filter(br => br instanceof LaneRate);
const allLaneRateValues = allLaneRates.flatMap(lr => lr.values);

const allWeightRates = allBaseRates.filter(br => br instanceof WeightRate);
const allWeightRateValues = allWeightRates.flatMap(wr => wr.values);

const allStopRates = allBaseRates.filter(br => br instanceof StopRate);
const allStopRateValues = allStopRates.flatMap(sr => sr.values);



describe(`Setup from ${ShipmentLane.name} to ${WeightRateValue.name}`, () => {

    beforeAll(() => {
        shipmentLaneRepository = app.get(getRepositoryToken(ShipmentLane));
        entityManager = app.get(getEntityManagerToken());
        shipmentLaneKeySettingsService = app.get<IShipmentLaneKeySettingsService>(SHIPMENT_LANE_KEY_SETTINGS_SERVICE);
    });

    beforeEach(async () => {
        spyInstances.push(
            jest.spyOn(shipmentLaneKeySettingsService, "prefix", "get").mockReturnValue(prefix),
            jest.spyOn(shipmentLaneKeySettingsService, "template", "get").mockReturnValue(codeTemplate)
        );

        expect(shipmentLane.id).toBeTruthy();

        expect(tariff.id).toBeTruthy();
        expect(tariff.shipmentLaneId).toBeTruthy();
        expect(tariff.shipmentLaneId).toBe(shipmentLane.id);

        expect(tariffValidity.id).toBeTruthy();
        expect(tariffValidity.tariffId).toBeTruthy();
        expect(tariffValidity.tariffId).toBe(tariff.id);

        expect(weightRate.id).toBeTruthy();
        expect(weightRate.tariffValidityId).toBeTruthy();
        expect(weightRate.tariffValidityId).toBe(tariffValidity.id);

        expect(weightRateValue.id).toBeTruthy();
        expect(weightRateValue.baseRateId).toBeTruthy();
        expect(weightRateValue.baseRateId).toBe(weightRate.id);

        await shipmentLaneRepository.save(shipmentLane);

        // await entityManager.transaction(async transactionalEntityManager => {

        //     const allEntities = [
        //         shipmentLane,
        //         ...allTariffs,
        //         ...allTariffValidities,
        //         ...allBaseRates,
        //         ...allBaseRateValues
        //     ];

        //     // 2. Group the entities by their class using reduce, directly accessing the constructor.
        //     const baseRateClasses = allEntities.reduce((groups, entity) => {
        //         // 1. Identify the class (the EntityTarget)
        //         const entityClass = entity.constructor;

        //         // 2. Get or initialize the array for this class
        //         const group = groups.get(entityClass) || [];

        //         // 3. Add the current entity to the array
        //         group.push(entity);

        //         // 4. Update the map
        //         groups.set(entityClass, group);

        //         // 5. Return the accumulator (the Map)
        //         return groups;
        //     }, new Map<Function, ObjectLiteral[]>());

        //     // 3. Execute the bulk inserts using the grouped map.
        //     for (const [entityClass, entities] of baseRateClasses.entries()) {
        //         await transactionalEntityManager.insert(entityClass, entities);
        //     }
        // });
    });

    afterEach(async () => {
        await shipmentLaneRepository.delete({});
        spyInstances.forEach(spy => spy.mockRestore());
    });

    test.only(`should persist successfully`, async () => {

        const savedShipmentLane = await shipmentLaneRepository.findOne({
            where: {
                id: shipmentLane.id
            },
            relations: {
                tariffs: {
                    validities: {
                        baseRates: {
                            values: true
                        }
                    }
                }
            }
        });

        expect(savedShipmentLane).toBeTruthy();
        expect(savedShipmentLane.tariffs).toHaveLength(allTariffs.length);
        expect(savedShipmentLane.tariffs.flatMap(t => t.validities)).toHaveLength(allTariffValidities.length);

        const baseRates = savedShipmentLane.tariffs.flatMap(t => t.validities).flatMap(v => v.baseRates);
        expect(baseRates).toHaveLength(allBaseRates.length);

        const baseRateValues = baseRates.flatMap(br => br.values);
        expect(baseRateValues).toHaveLength(allBaseRateValues.length);

        const laneRates = baseRates.filter(br => br instanceof LaneRate);
        expect(laneRates).toHaveLength(allLaneRates.length);

        const laneRateValues = laneRates.flatMap(lr => lr.values);
        expect(laneRateValues).toHaveLength(allLaneRateValues.length);

        const weightRates = baseRates.filter(br => br instanceof WeightRate);
        expect(weightRates).toHaveLength(allWeightRates.length);

        const weightRateValues = weightRates.flatMap(wr => wr.values);
        expect(weightRateValues).toHaveLength(allWeightRateValues.length);

        const stopRates = baseRates.filter(br => br instanceof StopRate);
        expect(stopRates).toHaveLength(allStopRates.length);

        const stopRateValues = stopRates.flatMap(sr => sr.values);
        expect(stopRateValues).toHaveLength(allStopRateValues.length);
        

        console.dir(savedShipmentLane, { depth: null });
    });

    test.skip(`should queryable`, async () => {  
        const shipmentLanes = await shipmentLaneRepository.find({
            where: { 
                tariffs: {
                    bizPartnerCode: ILike(`%${tariff.bizPartnerCode.substring(0, 2)}%`),
                    validities: {
                        validFrom: tariffValidity.validFrom,
                        baseRates: {
                            baseRateType: BaseRateType.WEIGHT,
                            values: {
                                baseRateType: BaseRateType.WEIGHT,
                                value: MoreThan(0)
                            }
                        }
                    }
                }
            },
            relations: {
                tariffs: {
                    validities: {
                        baseRates: {
                            values: true
                        }
                    }
                }
            },
            select: {
                id: true,
                code: true,
                tariffs: {
                    id: true,
                    code: true,
                    validities: {
                        id: true,
                        validFrom: true,
                        validTo: true,
                        baseRates: {
                            id: true,
                            baseRateType: true,
                            values: true
                        }
                    }
                }
            }
        });

        expect(shipmentLanes).toHaveLength(1);
        console.dir(shipmentLanes, { depth: null });
        
    });
});