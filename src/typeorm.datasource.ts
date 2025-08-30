import 'dotenv/config';
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { ConfigService } from '@nestjs/config';
import { DatabaseModuleOptions, DataSourceProperties } from './building-blocks/infra/database';
import { WhraModuleSchemas } from './w-hra-modules';

export const getDatabaseModuleSettings = (configService: ConfigService) : DatabaseModuleOptions => {
    return new DatabaseModuleOptions({
        url: configService.get<string>("POSTGRES_DATABASE_URL"),
        enableForLog: configService.get<string>("POSTGRES_LOG_ENABLED")?.toLowerCase() === 'true',
        autoMigration: true,
        migrations: [
            "dist/**/persistence/migrations/*.js"
        ]
    });
};

// =================
// Kudos: https://stackoverflow.com/a/77328342
// =================
const configService: ConfigService = new ConfigService();

const databaseModuleSettings: DatabaseModuleOptions = getDatabaseModuleSettings(configService);

const pgConnectionOptions = {
    ...DataSourceProperties,
    synchronize: false,
    url: databaseModuleSettings.url,
    entities: [
        ...WhraModuleSchemas
    ]
} as PostgresConnectionOptions;

export default new DataSource(pgConnectionOptions);