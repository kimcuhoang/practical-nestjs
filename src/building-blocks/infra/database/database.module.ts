import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModuleSettings } from "./database.module.settings";
import { DataSourceProperties } from "./datasource.properties";
import { Logger } from "testcontainers/build/common";

export type DatabaseModuleOptions = {
    getDatabaseModuleSettings(configService: ConfigService): DatabaseModuleSettings;
}

@Global()
@Module({})
export class DatabaseModule {
    public static register(options: DatabaseModuleOptions): DynamicModule {
        const logger = new Logger(DatabaseModule.name);
        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    inject: [DatabaseModuleSettings],
                    useFactory: async (databaseSettings: DatabaseModuleSettings) => {

                        const migrations = [
                            ...new Set([
                                        ...DataSourceProperties.migrations as any[],
                                        ...databaseSettings.migrations ])
                        ];

                        console.log(migrations);

                        return ({
                            ...DataSourceProperties,
                            url: databaseSettings.url,
                            logging: databaseSettings.enableForLog,
                            migrationsRun: databaseSettings.autoMigration,
                            migrations: migrations
                        });
                    }
                })
            ],
            providers: [
                {
                    provide: DatabaseModuleSettings,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        return options.getDatabaseModuleSettings(configService);
                    }
                }
            ],
            exports: [
                DatabaseModuleSettings
            ]
        };
    }
}