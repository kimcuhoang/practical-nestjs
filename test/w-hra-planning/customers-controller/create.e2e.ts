import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Customer, CustomerCommunicationType } from "@src/w-hra-modules/customers/domain";
import { CustomerCommunicationPayload, CustomerPayload } from "@src/w-hra-modules/customers/use-cases/commands/create/payloads";
import { CustomersController } from "@src/w-hra-planning/controllers/customers.controller";
import { app, request, TestHelpers } from "@test/test.setup";
import { Repository } from "typeorm";



describe(`Create ${Customer.name} via ${CustomersController.name}`, () => {
    let customerRepository: Repository<Customer>;

    beforeAll(() => {
        customerRepository = app.get(getRepositoryToken(Customer));
    });

    afterEach(async() => {
        await customerRepository.delete({});
    });

    test(`should be success`, async() => {
        const payload = {
            code: TestHelpers.genCode(),
            name: faker.person.fullName(),
            communications: faker.helpers.multiple(() => ({
                type: faker.helpers.enumValue(CustomerCommunicationType),
                value: faker.internet.email()
            } satisfies CustomerCommunicationPayload), { count: 3 })
        } satisfies CustomerPayload;

        const response = await request
                .post(`/customers`)
                .send(payload)
                .expect(HttpStatus.CREATED);

        const customerId = response.text;
        expect(customerId).toBeTruthy();

        const customer = await customerRepository.findOne({
            where: {
                id: customerId
            },
            relations: {
                communications: true
            }
        });

        expect(customer).toBeTruthy();
        expect(customer?.code).toBe(payload.code);
        expect(customer?.name).toBe(payload.name);
        expect(customer?.communications.length).toBe(payload.communications.length);
        payload.communications.forEach(origin => {
            const communication = customer?.communications.find(c => c.type === origin.type && c.value === origin.value);
            expect(communication).toBeTruthy();
        });
    });

});