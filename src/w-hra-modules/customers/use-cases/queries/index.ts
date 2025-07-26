import { SearchCustomersHandler } from "./search/search-customers.handler";


export const CustomersModuleQueryHandlers = [
    SearchCustomersHandler
];

export * from "./search/search-customers.request";
export * from "./search/search-customers.result";