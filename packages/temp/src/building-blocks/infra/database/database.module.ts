import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModuleOptions } from "./database.module.options";
import { DataSourceProperties } from "./datasource.properties";
import { Logger } from "testcontainers/build/common";
import { DataSource, DataSourceOptions } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";

// export type DatabaseModuleOptions = {
//     getDatabaseModuleSettings(configService: ConfigService): DatabaseModuleSettings;
// }

@Global()
@Module({})
export class DatabaseModule {
    public static register(configure: (configService: ConfigService) => DatabaseModuleOptions): DynamicModule {
        const logger = new Logger(DatabaseModule.name);
        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    inject: [DatabaseModuleOptions],
                    useFactory: async (databaseSettings: DatabaseModuleOptions) => {

                        const migrations = [
                            ...new Set([
                                        ...DataSourceProperties.migrations as any[],
                                        ...databaseSettings.migrations ])
                        ];

                        return ({
                            ...DataSourceProperties,
                            url: databaseSettings.url,
                            logging: databaseSettings.enableForLog,
                            synchronize: false,
                            migrationsRun: databaseSettings.autoMigration,
                            migrations: migrations
                        });
                    },
                    // async dataSourceFactory(options?: DataSourceOptions) {
                    //     if (!options) {
                    //         throw new Error("DataSourceOptions is required");
                    //     }
                    //     return addTransactionalDataSource(new DataSource(options));
                    // }
                })
            ],
            providers: [
                {
                    provide: DatabaseModuleOptions,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        return configure(configService);
                    }
                }
            ],
            exports: [
                DatabaseModuleOptions
            ]
        };
    }
}