import { Schemas } from "./src/projects/persistence";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";


const postgresClient = {
    user: "lab",
    password: "P@ssword",
    host: "localhost",
    port: "5432",
    database: "practical-nestjs"
};

const connectionString = `postgresql://${postgresClient.user}:${postgresClient.password}@${postgresClient.host}:${postgresClient.port}/${postgresClient.database}`;

const pgConnectionOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: connectionString,
    entities: [
        ...Schemas
    ],
    migrationsTableName: 'MigrationHistory',
    logging: true
};

export default new DataSource(pgConnectionOptions);