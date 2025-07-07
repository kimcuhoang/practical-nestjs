// import { faker } from "@faker-js/faker";
// import { getRepositoryToken } from "@nestjs/typeorm";
// import { Surcharge, SurchargeArguments, SurchargeType } from "@src/tariffs/domain/models/surcharge.entities";
// import { app } from "@test/test.setup";
// import { Repository } from "typeorm";


// describe('TariffsModule - Save Surcharge E2E', () => {
//     let surchargeRepository: Repository<Surcharge>;

//     beforeAll(() => {
//         surchargeRepository = app.get(getRepositoryToken(Surcharge));
//     });

//     afterEach(async () => {
//         await surchargeRepository.delete({});
//     });

//     it('should save a Surcharge successfully', async () => {
//         const surcharge = new Surcharge();
//         surcharge.amount = faker.number.int({ min: 1, max: 1000 });
//         surcharge.surchargeType = SurchargeType.PER_STOP;
//         surcharge.arguments = new SurchargeArguments({
//             maxAmountOfStops: faker.number.int({ min: 1, max: 10 }),
//         });

//         await surchargeRepository.save(surcharge);

//         const savedSurcharge = await surchargeRepository.findOneBy({ id: surcharge.id });
//         expect(savedSurcharge).toBeTruthy();
//         expect(savedSurcharge?.amount).toBe(surcharge.amount);
//         expect(savedSurcharge?.surchargeType).toBe(surcharge.surchargeType);
//         expect(savedSurcharge?.arguments).toEqual(surcharge.arguments);
//     });
// });