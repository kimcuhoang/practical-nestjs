import { IsNotEmpty, IsString } from "class-validator";

export class ProjectData {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    @IsString()
    name: string;
    constructor(data: Partial<ProjectData>){
        Object.assign(this, data);
    }
}

export class ImportByCsvResult {
    projects: ProjectData[] = [];
    constructor(result: Partial<ImportByCsvResult>) {
        Object.assign(this, result);
    }
}