import { CreatePersonHandler } from "./commands/create-person/create-person.handler";


const commandHandlers = [
    CreatePersonHandler
];

const PeopleModuleHandlers = [...commandHandlers];

export default PeopleModuleHandlers;

export * from "./commands/create-person/create-person.payload";
export * from "./commands/create-person/create-person.command";