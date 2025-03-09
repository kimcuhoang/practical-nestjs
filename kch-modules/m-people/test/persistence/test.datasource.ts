import { DefaultPostgresConnectionOptions } from "@kch/domain-n-typeorm";
import { DomainEntities } from "@src/domain";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";


const options = {
    ...DefaultPostgresConnectionOptions,
    url: "postgres://postgres:postgres@localhost:5432/m-people",
    entities: [ ...DomainEntities ],
} as PostgresConnectionOptions;

export default new DataSource(options);
