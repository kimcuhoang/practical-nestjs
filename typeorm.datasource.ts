import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import * as glob from 'glob';

const postgresClient = {
    user: "lab",
    password: "P@ssword",
    host: "localhost",
    port: "5432",
    database: "practical-nestjs"
};

const connectionString = `postgresql://${postgresClient.user}:${postgresClient.password}@${postgresClient.host}:${postgresClient.port}/${postgresClient.database}`;


// const dir = 'dist/**/*.schema{.js,.ts}';

// console.log(dir);

// glob(dir, (err: any, tsFiles: any) => {
//     if (err) {
//         console.error("Error during asynchronous file matching:", err);
//         return;
//     }
//     console.log("Selected TypeScript files asynchronously:", tsFiles);
// });

const pgConnectionOptions: PostgresConnectionOptions = {
    type: 'postgres',
    url: connectionString,
    entities: [
        'dist/**/*.schema{.js,.ts}'
    ],
    migrations: [
        'dist/**/migrations/*{.js,.ts}'
    ],
    migrationsTableName: 'MigrationHistory',
    logging: true,
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy()
};

export default new DataSource(pgConnectionOptions);