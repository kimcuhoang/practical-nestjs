import { Identifiable } from "@src/domain";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class YanEntity implements Identifiable<number> {

    constructor(entity: Partial<YanEntity>) {
        Object.assign(this, entity);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @CreateDateColumn({ nullable: false })
    createdAtUtc: Date;
}