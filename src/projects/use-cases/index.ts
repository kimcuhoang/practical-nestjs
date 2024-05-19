
import { FindByIdHandler } from "./project/queries/find-by-id/find-by-id.handler";
import { SearchProjectsHandler } from "./project/queries/search/search-projects.handlers";
import { CreateProjectHandler } from "./project/commands/create/create-project.handler";

const CommandHandlers = [
    CreateProjectHandler
]

const QueryHandlers = [
    SearchProjectsHandler,
    FindByIdHandler
]

export const Handlers = [ ...CommandHandlers, ...QueryHandlers ];

export * from "./project/commands/create/create-project.request";
export * from "./project/queries/find-by-id/find-by-id.request";
export * from "./project/queries/search/search-projects.request";