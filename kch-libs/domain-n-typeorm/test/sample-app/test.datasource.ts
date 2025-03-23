import { DataSource } from "typeorm";
import { Entities } from "./entities";
import { DefaultPostgresConnectionOptions } from "@src/persistence";

export default new DataSource({
    ...DefaultPostgresConnectionOptions,
    url: "postgres://postgres:postgres@localhost:5432/a-test-db",
    entities: [ ...Entities ]
});