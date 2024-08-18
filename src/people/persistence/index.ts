import { AssignmentProjectSchema } from "./schemas/assignment-project.schema";
import { PersonSchema } from "./schemas/person.schema";

const PeopleModuleSchemas = [
    PersonSchema,
    AssignmentProjectSchema
];

export default PeopleModuleSchemas;