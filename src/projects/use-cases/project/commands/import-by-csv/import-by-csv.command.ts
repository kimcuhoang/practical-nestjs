import { ICommand } from "@nestjs/cqrs";


export class ImportByCsvCommand implements ICommand {
    constructor(
        public readonly file: Express.Multer.File
    ){}
}