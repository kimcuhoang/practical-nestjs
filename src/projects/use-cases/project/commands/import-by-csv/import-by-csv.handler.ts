import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ImportByCsvCommand } from "./import-by-csv.command";
import { ImportByCsvResult, ProjectData } from "./import-by-csv.results";
import { parse, format } from 'fast-csv';
import { BadRequestException, Logger } from "@nestjs/common";
import { Readable } from "stream";
import { FileValidatorService } from "@src/building-blocks/services/file-validator.service";
import { validateSync, ValidationError } from "class-validator";

@CommandHandler(ImportByCsvCommand)
export class ImportByCsvHandler implements ICommandHandler<ImportByCsvCommand, ImportByCsvResult> {

    private readonly logger = new Logger(ImportByCsvHandler.name);

    private readonly headers = [
        "product_code",
        "name"
    ];

    constructor(
        private readonly fileValidatorService: FileValidatorService
    ){ }

    public async execute(command: ImportByCsvCommand): Promise<ImportByCsvResult> {

        const validationResult = this.fileValidatorService.validate(command.file, {
            allowMimeTypes: [ "text/csv" ],
            allowMaxFileSizeInMB: 1
        });

        if (validationResult) {
            throw new BadRequestException(validationResult.message);
        }

        return new Promise((resolve, reject) => {
            const projects: ProjectData[] = [];
            let rowNumber = 0;
            type CsvRowData = { project_code: string, name: string };
            const stream = Readable.from(command.file.buffer);

            stream
            .pipe(parse<CsvRowData, ProjectData>({ 
                headers: true, 
                // skipRows: 1, 
                discardUnmappedColumns: true, ignoreEmpty: true, trim: true }))
            // .pipe(format<CsvRowData, ProjectData>({ headers: this.headers, writeHeaders: false }))
            .transform(
                (row: CsvRowData): ProjectData => {
                    return new ProjectData({
                        code: row.project_code,
                        name: `[${row.project_code}]-${row.name}`
                    })
                }
            )
            .validate(
                (project: ProjectData, callback): void => {
                    const validationResults: ValidationError[] = validateSync(project, { stopAtFirstError: true, whitelist: true });

                    if (validationResults.length === 0) {
                        return callback(null, true);
                    }

                    const errors = validationResults.map(v => {
                        return {
                            field: v.property,
                            errorKeys: Object.keys(v.constraints).toString(),
                            errors: Object.values(v.constraints).toString()
                        };
                    });

                    return callback(null, false, JSON.stringify(errors));
                }
            )
            // .on("data-invalid", (row: CsvRowData, rowNumber: number, message: string) =>
            //     console.error(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}] [errors=${message}]`),
            // )
            .on("error", (error: Error) => {
                this.logger.error(error);
                reject(error);
            })
            .on("data", (project: ProjectData) => {
                rowNumber++;
                projects.push(project);
            })
            .on("end", () => {
                this.logger.log(projects);
                resolve(new ImportByCsvResult({
                    projects: [ ...projects ]
                }))
            });
        });
    }
}