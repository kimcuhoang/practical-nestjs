import { DynamicModule, Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModuleOptions } from "./persistence/database.module.options";
import { DataSourceProperties } from "./persistence/datasource.properties";
import { DataSource, DataSourceOptions } from "typeorm";
import { addTransactionalDataSource, getDataSourceByName } from "typeorm-transactional";

@Module({})
export class DatabaseModule {
    public static register(configure: (configService: ConfigService) => DatabaseModuleOptions): DynamicModule {
        const logger = new Logger(DatabaseModule.name);
        return {
            module: DatabaseModule,
            global: true,
            imports: [
                TypeOrmModule.forRootAsync({
                    inject: [DatabaseModuleOptions],
                    useFactory: async (databaseSettings: DatabaseModuleOptions) => {
                        return ({
                            ...DataSourceProperties,
                            migrations: databaseSettings.migrations || [],
                            url: databaseSettings.url,
                            logging: databaseSettings.enableForLog,
                            synchronize: false,
                            migrationsRun: databaseSettings.autoMigration,
                        });
                    },
                    async dataSourceFactory(options?: DataSourceOptions): Promise<DataSource> {
                        if (!options) {
                            throw new Error("DataSourceOptions is required");
                        }
                        return getDataSourceByName('default')
                            || addTransactionalDataSource(new DataSource(options));
                    }
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