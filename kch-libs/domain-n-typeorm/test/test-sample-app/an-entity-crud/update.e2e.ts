import { getRepositoryToken } from "@nestjs/typeorm";
import { AnEntity } from "@test/sample-app/entities";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";
import { ulid } from "ulidx";


describe(`Update an "${AnEntity.name}"`, () => {    
    let anEntityRepository: Repository<AnEntity>;
    let anEntity: AnEntity;

    beforeAll(async () => {
        anEntityRepository = app.get(getRepositoryToken(AnEntity));
    });

    beforeEach(async () => {
        anEntity = new AnEntity(ulid(), { name: "test" });
        await anEntityRepository.save(anEntity);
    });

    afterEach(async () => {
        await anEntityRepository.delete({});
    });

    it(`should be success`, async () => {
        const savedAnEntity = await anEntityRepository.findOne({ where: { id: anEntity.id } });
        expect(savedAnEntity).toBeTruthy();

        savedAnEntity.name = "updated";
        await anEntityRepository.save(savedAnEntity);

        const updatedResult = await anEntityRepository.findOne({ where: { id: anEntity.id } });
        expect(updatedResult.name).toEqual(savedAnEntity.name);
        expect(updatedResult.createdAtUtc).toEqual(savedAnEntity.createdAtUtc);
        expect(updatedResult.updatedAtUtc).toEqual(savedAnEntity.updatedAtUtc);
        expect(updatedResult.deletedAtUtc).toBeFalsy();
    });
});