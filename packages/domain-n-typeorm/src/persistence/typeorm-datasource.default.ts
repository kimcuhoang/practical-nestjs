
import { ConfigService } from "@nestjs/config";
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DatabaseOptions, DefaultDatasourceOptions } from "./typeorm-datasource.configurations";

export const getDatabaseOptions = (configService: ConfigService): DatabaseOptions => {
    return {
        url: configService.get<string>("POSTGRES_DATABASE_URL"),
        logging: configService.get<string>("POSTGRES_LOG_ENABLED")?.toLowerCase() === "true",
        migrationsRun: true,
    } as DatabaseOptions;
};

const configService = new ConfigService();
const databaseOptions: DatabaseOptions = getDatabaseOptions(configService);

// const pgConnectionOptions = {
//     ...DefaultDatasourceOptions,
//     ...databaseOptions,
//     entities: [
//         AnEntity
//     ]
// } as PostgresConnectionOptions;

// export default new DataSource(pgConnectionOptions);

export const DefaultPostgresConnectionOptions = {
    ...DefaultDatasourceOptions,
    ...databaseOptions
} as PostgresConnectionOptions;