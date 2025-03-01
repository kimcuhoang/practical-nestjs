import { EntityBase } from "@src/domain";
import { Column, Entity, Table } from "typeorm";

@Entity()
export class AnEntity extends EntityBase {

  constructor(id: string, entity: Partial<AnEntity>) {
    super(id);
    Object.assign(this, entity);
  }

  @Column({ type: "varchar", length: 100 })
  name: string;
}