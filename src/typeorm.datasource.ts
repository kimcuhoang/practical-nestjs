import 'dotenv/config';
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { ConfigService } from '@nestjs/config';
import { DatabaseModuleSettings, DataSourceProperties } from './building-blocks/infra/database';

export const getDatabaseModuleSettings = (configService: ConfigService) : DatabaseModuleSettings => {
    return new DatabaseModuleSettings({
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

const databaseModuleSettings: DatabaseModuleSettings = getDatabaseModuleSettings(configService);

const pgConnectionOptions = {
    ...DataSourceProperties,
    url: databaseModuleSettings.url,
    entities: [ 'dist/**/*.schema.js' ]
} as PostgresConnectionOptions;

export default new DataSource(pgConnectionOptions);