import { DataSource } from "typeorm";
import { DefaultPostgresConnectionOptions } from "../persistence/typeorm-datasource.default";
import { AnEntity } from "./entities/an-entity";


export default new DataSource({
    ...DefaultPostgresConnectionOptions,
    url: "postgres://postgres:postgres@localhost:5432/a-test-db",
    entities: [ 
        AnEntity,
        "dist/sample-app/entities/*.js"
    ]
});