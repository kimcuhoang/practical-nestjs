import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationsService {
    constructor(
        @Inject('CONFIGURATIONS') private readonly configurations: string,
    ){}

    getConnectionStringV1(): string {
        return this.configurations;
    }
}
