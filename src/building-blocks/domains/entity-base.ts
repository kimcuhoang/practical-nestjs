export abstract class EntityBase {
    id: string;
    createdAt: Date;
    modifiedAt?: Date | null = null;
    deleted? : boolean | null = null;
    deletedAt?: Date | null = null;

    constructor(id: string){
        this.id = id;
        this.createdAt = new Date();
    }
}