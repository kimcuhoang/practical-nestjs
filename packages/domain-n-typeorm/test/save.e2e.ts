import { AnEntity } from "@src/sample-app/entities/an-entity";
import { Repository } from "typeorm";
import { app } from "./test.setup";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ulid } from "ulidx";


describe(`Save ${AnEntity.name}`, () => {

    let anEntityRepository: Repository<AnEntity>;

    beforeAll(async () => {
        anEntityRepository = app.get(getRepositoryToken(AnEntity));
    });

    afterEach(async () => {
        await anEntityRepository.delete({});
    });

    it(`should save ${AnEntity.name}`, async () => {
        const anEntity = new AnEntity(ulid(), { name: "test" });
        await anEntityRepository.save(anEntity);

        const result = await anEntityRepository.findOne({ where: { id: anEntity.id } });
        expect(result).toEqual(anEntity);
    });
    
});