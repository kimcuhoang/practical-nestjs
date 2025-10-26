import { Injectable } from "@nestjs/common";
import { IShipmentKeyGenerator } from "./shipment-key-generator.interface";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { ShipmentsSequences } from "../../persistence/sequences";

@Injectable()
export class DefaultShipmentKeyGenerator implements IShipmentKeyGenerator {
    
    constructor(
        @InjectEntityManager()
        protected readonly entityManager: EntityManager,
    ){}

    public async loadSettings(): Promise<void> {
        await Promise.resolve();
    }

    public get shipmentKeyPrefix(): string {
        return "SHIP";
    }

    public get shipmentKeyTemplate(): string {
        return "#########";
    }

    public get shipmentKeySequenceEnd(): number {
        return 9999999999;
    }

    public async generate(): Promise<string> {
        const nextSequenceValue = await this.getNextSequenceValue();
        if (nextSequenceValue >= this.shipmentKeySequenceEnd) {
            throw new Error("Shipment Key Sequence has reached its maximum value");
        }
        return `${this.shipmentKeyPrefix}${String(nextSequenceValue).padStart(this.shipmentKeyTemplate.length, '0')}`;
    }

    protected async getNextSequenceValue(): Promise<number> {
        const result = await this.entityManager.query(`SELECT nextval('public.${ShipmentsSequences.shipmentSequence}') as seq`);
        return result[0].seq;
    }
}