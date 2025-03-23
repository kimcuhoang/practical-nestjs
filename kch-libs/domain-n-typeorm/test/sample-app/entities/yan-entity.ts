import { Identifiable } from "@src/domain";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class YanEntity implements Identifiable<number> {

    constructor(id: number, entity: Partial<YanEntity>) {
        this.id = id;
        Object.assign(this, entity);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100 })
    name: string;
}