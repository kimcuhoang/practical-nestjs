import { AnEntity } from "@test/sample-app/entities/an-entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ulid } from "ulidx";
import { app } from "@test/test.setup";

describe(`Create a new "${AnEntity.name}"`, () => {

    let anEntityRepository: Repository<AnEntity>;

    beforeAll(async () => {
        anEntityRepository = app.get(getRepositoryToken(AnEntity));
    });

    afterEach(async () => {
        await anEntityRepository.delete({});
    });

    it(`should be success`, async () => {
        const anEntity = new AnEntity(ulid(), { name: "test" });
        await anEntityRepository.save(anEntity);

        const result = await anEntityRepository.findOne({ where: { id: anEntity.id } });
        expect(result).toEqual(anEntity);
        expect(result.createdAtUtc).toBeTruthy();
        expect(result.updatedAtUtc).toBeTruthy();
        expect(result.deletedAtUtc).toBeFalsy();
    });
    
});