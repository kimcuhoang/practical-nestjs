import { getRepositoryToken } from "@nestjs/typeorm";
import { SurchargeArguments, SurchargeType } from "@src/old-sources/tariffs/domain/models/surcharge.entities";
import { Tariff } from "@src/old-sources/tariffs/domain/models/tariff";
import { app, moment } from "@test/test.setup";
import { Repository } from "typeorm";


describe('tariffs module - save tariff', () => {
    let tariffRepository: Repository<Tariff>;

    beforeAll(() => {
        tariffRepository = app.get(getRepositoryToken(Tariff));
    });

    afterEach(async() => {
        await tariffRepository.delete({});
    });

    it('should save a new tariff', async () => {
        const newTariff = new Tariff();
        newTariff.name = 'Test Tariff';

        const savedTariff = await tariffRepository.save(newTariff);
        expect(savedTariff).toBeTruthy();
        expect(savedTariff.name).toBe('Test Tariff');
    });

    it('should save a new tariff with validities', async () => {
        const newTariff = new Tariff();
        newTariff.name = 'Test Tariff with Validities';
        newTariff
            .addValidity({
                startDate: moment.utc().startOf('month').toDate(),
                endDate: moment.utc().endOf('month').toDate(),
                amount: 100
            })
            .addValidity({
                startDate: moment.utc().startOf('month').add(1, 'month').toDate(),
                endDate: moment.utc().endOf('month').add(1, 'month').toDate(),
                amount: 150
            });

        const result = await tariffRepository.save(newTariff);

        const savedTariff = await tariffRepository.findOne({
            where: {
                id: result.id
            },
            relations: {
                validities: true
            }
        });

        expect(savedTariff).toBeTruthy();
        expect(savedTariff.name).toBe('Test Tariff with Validities');
        expect(savedTariff.validities).toHaveLength(newTariff.validities.length);
    });

    it('should save a new tariff with surcharges', async () => {
        const newTariff = new Tariff();
        newTariff.name = 'Test Tariff with Surcharges';
        newTariff
            .addSurcharge({
                surchargeType: SurchargeType.PER_STOP,
                amount: 50,
                arguments: new SurchargeArguments({
                    maxAmountOfStops: 5
                })
            })
            .addSurcharge({
                surchargeType: SurchargeType.PEAK_SEASON_HOLIDAY,
                amount: 200,
                arguments: new SurchargeArguments({
                    peakSeasonStart: moment.utc().startOf('month').toDate(),
                    peakSeasonEnd: moment.utc().endOf('month').toDate()
                })
            });

        const result = await tariffRepository.save(newTariff);

        const savedTariff = await tariffRepository.findOne({
            where: {
                id: result.id
            },
            relations: {
                surcharges: true
            }
        });
        expect(savedTariff).toBeTruthy();
        expect(savedTariff.name).toBe('Test Tariff with Surcharges');
        expect(savedTariff.surcharges).toHaveLength(newTariff.surcharges.length);
    });

    it('should save a new tariff with both validities and surcharges', async () => {
        const newTariff = new Tariff();
        newTariff.name = 'Test Tariff with Validities and Surcharges';
        newTariff
            .addValidity({
                startDate: moment.utc().startOf('month').toDate(),
                endDate: moment.utc().endOf('month').toDate(),
                amount: 100
            })
            .addSurcharge({
                surchargeType: SurchargeType.PER_STOP,
                amount: 50,
                arguments: new SurchargeArguments({
                    maxAmountOfStops: 5
                })
            });

        const result = await tariffRepository.save(newTariff);

        const savedTariff = await tariffRepository.findOne({
            where: {
                id: result.id
            },
            relations: {
                validities: true,
                surcharges: true
            }
        });

        expect(savedTariff).toBeTruthy();
        expect(savedTariff.name).toBe('Test Tariff with Validities and Surcharges');
        expect(savedTariff.validities).toHaveLength(newTariff.validities.length);
        expect(savedTariff.surcharges).toHaveLength(newTariff.surcharges.length);
    });
});