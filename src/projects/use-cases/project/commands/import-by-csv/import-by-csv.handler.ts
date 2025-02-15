import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ImportByCsvCommand } from "./import-by-csv.command";
import { ImportByCsvResult } from "./import-by-csv.results";
import { parse } from 'fast-csv';
import { BadRequestException, Logger } from "@nestjs/common";
import { Readable } from "stream";
import { FileValidatorService } from "@src/building-blocks/services/file-validator.service";

@CommandHandler(ImportByCsvCommand)
export class ImportByCsvHandler implements ICommandHandler<ImportByCsvCommand, ImportByCsvResult> {

    private readonly logger = new Logger(ImportByCsvHandler.name);

    constructor(
        private readonly fileValidatorService: FileValidatorService
    ){ }

    public async execute(command: ImportByCsvCommand): Promise<ImportByCsvResult> {

        const validationResult = this.fileValidatorService.validate(command.file, {
            allowMimeTypes: [ "text/csv" ],
            allowMaxFileSize: 1
        });

        if (validationResult) {
            throw new BadRequestException(validationResult.message);
        }

        return new Promise((resolve, reject) => {
            const projectCodes: string[] = [];
            const stream = Readable.from(command.file.buffer);
            let rowNumber = 0;

            stream.pipe(parse({
                headers: ["code"],
                ignoreEmpty: true,
                skipRows: 1,
                strictColumnHandling: true,
                discardUnmappedColumns: true,
                encoding: 'utf8',
                trim: true,
                ltrim: true,
            }))
            .on("error", (error: Error) => {
                this.logger.error(error);
                reject(error);
            })
            .on("data", (data: any) => {
                rowNumber++;
                projectCodes.push(data.code);
            })
            .on("end", () => {
                this.logger.log(projectCodes);
                resolve(new ImportByCsvResult({
                    projectCodes: [ ...projectCodes ]
                }))
            });
        });
    }
}