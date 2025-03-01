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
}

