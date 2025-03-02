import { ConfigService } from "@nestjs/config";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export type DatabaseOptions = Pick<PostgresConnectionOptions, "url" | "entities" | "migrations" | "migrationsRun" | "logging">;

export const DefaultDatasourceOptions: PostgresConnectionOptions = {
    type: "postgres",
    synchronize: false,
    logging: false,
    migrationsTableName: "migration_histories",
    namingStrategy: new SnakeNamingStrategy(),
    useUTC: true,
};

export const getDatabaseOptions = (configService: ConfigService): DatabaseOptions => {
    return {
        url: configService.get<string>("POSTGRES_DATABASE_URL"),
        logging: configService.get<string>("POSTGRES_LOG_ENABLED")?.toLowerCase() === "true",
        migrationsRun: true,
    } as DatabaseOptions;
};

const configService = new ConfigService();
export const DefaultPostgresConnectionOptions = {
    ...DefaultDatasourceOptions,
    ...getDatabaseOptions(configService),
} as PostgresConnectionOptions;

