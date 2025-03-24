import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { app } from "@test/test.setup";
import { YanEntity } from "@test/sample-app/entities";

describe(`Create a new "${YanEntity.name}"`, () => {

    let anEntityRepository: Repository<YanEntity>;

    beforeAll(async () => {
        anEntityRepository = app.get(getRepositoryToken(YanEntity));
    });

    afterEach(async () => {
        await anEntityRepository.delete({});
    });

    test(`should be success`, async () => {
        const anEntity = new YanEntity({ name: "test" });
        const savedResult = await anEntityRepository.save(anEntity);

        const result = await anEntityRepository.findOne({ where: { id: savedResult.id } });
        expect(result).toEqual(savedResult);
        expect(result.createdAtUtc).toBeTruthy();
    });
    
});