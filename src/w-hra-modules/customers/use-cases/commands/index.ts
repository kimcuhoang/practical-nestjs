import { CreateCustomerHandler } from "./create/create-customer.handler";

export const CustomersModuleCommandHandlers = [
    CreateCustomerHandler
];

export * from "./create/create-customer.command";
export * from "./create/payloads";