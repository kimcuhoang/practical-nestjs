import { DataSource, EntityManager, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { ShipmentLane } from "../../domain";
import { ShipmentLaneSequence } from "../sequences";
import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";


@Injectable()
@EventSubscriber()
export class ShipmentLaneSubscriber implements EntitySubscriberInterface<ShipmentLane> {

    constructor(
        @InjectDataSource() 
        private readonly dataSource: DataSource,
    ) {
        this.dataSource.subscribers.push(this);
    }

    listenTo() {
        return ShipmentLane;
    }

    public async beforeInsert(event: InsertEvent<ShipmentLane>): Promise<void> {
        const entityManager = event.manager;
        const entity = event.entity;

        const nextValue = await this.getNextSequenceValue(entityManager);

        const codeTemplate = "#########";
        entity.code = `L${String(nextValue).padStart(codeTemplate.length, '0')}`
    }

    private async getNextSequenceValue(entityManager: EntityManager): Promise<number> {

        // Hint: can get repository like that
        //const shipmentLaneRepository: Repository<ShipmentLane> = entityManager.getRepository(getRepositoryToken(ShipmentLane));

        const result = await entityManager.query(`SELECT nextval('public.${ShipmentLaneSequence}') as nextval`);
        return result[0].nextval;
    }

}