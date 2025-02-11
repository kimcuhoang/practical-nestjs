import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ImportByCsvCommand } from "./import-by-csv.command";
import { ImportByCsvResult } from "./import-by-csv.results";
import { parse } from 'fast-csv';
import { Logger } from "@nestjs/common";
import { Readable } from "stream";

@CommandHandler(ImportByCsvCommand)
export class ImportByCsvHandler implements ICommandHandler<ImportByCsvCommand, ImportByCsvResult> {

    private readonly logger = new Logger(ImportByCsvHandler.name);

    public async execute(command: ImportByCsvCommand): Promise<ImportByCsvResult> {

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