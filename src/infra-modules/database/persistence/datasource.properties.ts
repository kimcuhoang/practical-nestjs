import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";


export const DataSourceProperties = {
    type: 'postgres',
    migrations: [ "dist/**/persistence/migrations/*.js" ],
    synchronize: false,
    migrationsTableName: "migration_histories",
    namingStrategy: new SnakeNamingStrategy(),
    autoLoadEntities: true,
    migrationsTransactionMode: "all",
    useUTC: true,
    dateStrings: ["timestamp without time zone"],
    timezone: "UTC",
} as TypeOrmModuleOptions;