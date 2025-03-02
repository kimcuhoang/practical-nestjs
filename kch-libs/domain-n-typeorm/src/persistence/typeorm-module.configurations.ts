import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DatabaseOptions, DefaultDatasourceOptions, getDatabaseOptions } from "./typeorm-datasource.configurations";
import { DataSource, DataSourceOptions } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";


export const ConfigurableTypeOrmModule = (configure: (configService: ConfigService) => DatabaseOptions) => {
    return TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            return {
                ...DefaultDatasourceOptions,
                ...getDatabaseOptions(configService),
                ...configure(configService)
            } as TypeOrmModuleOptions;
        },
        dataSourceFactory: async (options) => {
            if (!options) {
                throw new Error('Invalid options passed');
            }
            const dataSource = new DataSource(options as DataSourceOptions);
            return addTransactionalDataSource(dataSource as any);
        }
    });
}
