import { Injectable } from "@nestjs/common";


@Injectable()
export class FileValidatorService {

    public validate(file: Express.Multer.File, validationOptions: { allowMimeTypes: string[], allowMaxFileSizeInMB: number }): Error | undefined {
        
        if (!validationOptions.allowMimeTypes.includes(file.mimetype)) {
            return new Error(`Support only ${validationOptions.allowMimeTypes.toString()}`);
        }

        if (file.size > validationOptions.allowMaxFileSizeInMB * 1024 * 1024) {
            return new Error(`Exceed ${validationOptions.allowMaxFileSizeInMB} MB`);
        }

        return undefined;
    }
}