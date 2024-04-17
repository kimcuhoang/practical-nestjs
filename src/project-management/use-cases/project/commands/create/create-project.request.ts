import { CreateProjectPayload } from "./create-project.payload";


export class CreateProjectRequest {
    constructor(
        readonly payload: CreateProjectPayload) {}
}