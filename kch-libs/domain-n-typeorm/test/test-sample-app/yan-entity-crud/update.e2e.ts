import { getRepositoryToken } from "@nestjs/typeorm";
import { YanEntity } from "@test/sample-app/entities";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";


describe(`Update an "${YanEntity.name}"`, () => {    
    let yanEntityRepository: Repository<YanEntity>;
    let yanEntity: YanEntity;

    beforeAll(async () => {
        yanEntityRepository = app.get(getRepositoryToken(YanEntity));
    });

    beforeEach(async () => {
        yanEntity = new YanEntity({ name: "test" });
        await yanEntityRepository.save(yanEntity);
    });

    afterEach(async () => {
        await yanEntityRepository.delete({});
    });

    it(`should be success`, async () => {
        const savedAnEntity = await yanEntityRepository.findOne({ where: { id: yanEntity.id } });
        expect(savedAnEntity).toBeTruthy();

        savedAnEntity.name = "updated";
        await yanEntityRepository.save(savedAnEntity);

        const updatedResult = await yanEntityRepository.findOne({ where: { id: yanEntity.id } });
        expect(updatedResult.name).toEqual(savedAnEntity.name);
        expect(updatedResult.createdAtUtc).toEqual(savedAnEntity.createdAtUtc);
    });
});