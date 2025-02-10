
import { FindByIdHandler } from "./project/queries/find-by-id/find-by-id.handler";
import { SearchProjectsHandler } from "./project/queries/search/search-projects.handlers";
import { CreateProjectHandler } from "./project/commands/create/create-project.handler";
import { BulkInsertProjectHandler } from "./project/commands/bulk-insert/bulk-insert-project.handler";

const CommandHandlers = [
    CreateProjectHandler,
    BulkInsertProjectHandler
]

const QueryHandlers = [
    SearchProjectsHandler,
    FindByIdHandler
]

export const Handlers = [ ...CommandHandlers, ...QueryHandlers ];

export * from "./project/commands/create/create-project.request";
export * from "./project/commands/bulk-insert/bulk-insert-project.command";

export * from "./project/queries/find-by-id/find-by-id.request";
export * from "./project/queries/search/search-projects.request";