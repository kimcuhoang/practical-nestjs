import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePersonCommand } from "./create-person.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Person } from "@src/people/core";
import { Repository } from "typeorm";
import { CreatePersonPayload } from "./create-person.payload";

@CommandHandler(CreatePersonCommand)
export class CreatePersonHandler implements ICommandHandler<CreatePersonCommand, string> {

    constructor(
        @InjectRepository(Person) private readonly personRespository: Repository<Person>
    ) {}

    public async execute(command: CreatePersonCommand): Promise<string> {
        const payload = command.payload as CreatePersonPayload;
        const person = Person.create(p => {
            p.name = payload.name;
        });

        await this.personRespository.save(person);

        return person.id;
    }

}