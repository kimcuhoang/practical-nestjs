import { getRepositoryToken } from "@nestjs/typeorm";
import { AnEntity } from "@test/sample-app/entities";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";
import { ulid } from "ulidx";


describe(`Soft delete an "${AnEntity.name}"`, () => {    
    let anEntityRepository: Repository<AnEntity>;
    let anEntity: AnEntity;

    beforeAll(() => {
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

        await anEntityRepository.softDelete(savedAnEntity.id);

        const deletedResult = await anEntityRepository.findOne({ where: { id: anEntity.id } });
        expect(deletedResult).toBeFalsy();

        const deletedResultWithDeleted = await anEntityRepository.findOne({ where: { id: anEntity.id }, withDeleted: true });
        expect(deletedResultWithDeleted.deletedAtUtc).toBeTruthy();
    });
});
