import { EntityBase } from "@kch/domain-n-typeorm";
import { Column, Entity } from "typeorm";

@Entity({ name: "members" })
export class Member extends EntityBase {
    @Column({ type: "varchar", length: 100, nullable: false })
    name: string;
    
    @Column({ type: "varchar", length: 100, nullable: false })
    email: string;

    constructor(id: string, member: Partial<Member>) {
        super(id);
        Object.assign(this, member);
    }
}