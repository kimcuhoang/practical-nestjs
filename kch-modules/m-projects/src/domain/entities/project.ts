import { EntityBase } from "@kch/domain-n-typeorm";
import { Column, Entity } from "typeorm";

@Entity({ name: "projects" })
export class Project extends EntityBase {
    constructor(id: string, project: Partial<Project>) {
        super(id);
        Object.assign(this, project);
    }

    @Column({ type: "varchar", length: 100, nullable: false })
    name: string;

    @Column({ type: Date, nullable: true })
    startDate?: Date | undefined;

    @Column({ type: Date, nullable: true })
    endDate?: Date | undefined;
}