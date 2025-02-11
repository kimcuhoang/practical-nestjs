
export class ImportByCsvResult {
    projectCodes: string[] = [];
    constructor(result: Partial<ImportByCsvResult>) {
        Object.assign(this, result);
    }
}