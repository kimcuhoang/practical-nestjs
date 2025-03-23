import { CreateDateColumn, DeleteDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Identifiable } from "./identifiable";


export abstract class EntityBase implements Identifiable<string> {

    @PrimaryColumn({ type: 'varchar', length: 26 })
    public readonly id: string;

    @CreateDateColumn({ nullable: false })
    public createdAtUtc: Date;

    @UpdateDateColumn({ nullable: true })
    public updatedAtUtc?: Date | null;

    @DeleteDateColumn({ nullable: true })
    public deletedAtUtc?: Date | null;

    constructor(id: string){
        this.id = id
    }
}