import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCustomerCommand } from "./create-customer.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "@src/w-hra-modules/customers/domain";
import { Repository } from "typeorm";
import { plainToInstance } from "class-transformer";
import { Propagation, runInTransaction } from "typeorm-transactional";

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand, string> {

    constructor(
        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>
    ){}

    public async execute(command: CreateCustomerCommand): Promise<string> {

        return await runInTransaction(async() => {
            const customer = plainToInstance(Customer, command.payload);
            const savedResult = await this.customerRepository.save(customer);
            return savedResult.id;

        }, { propagation: Propagation.NESTED });
    }
}