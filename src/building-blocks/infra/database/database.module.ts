import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseConfigurableModuleClass, DatabaseModuleOptions } from './database.module-definition';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({})
export class DatabaseModule extends DatabaseConfigurableModuleClass {

    public static register(options: DatabaseModuleOptions): DynamicModule {

        const typeOrmModule = TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'),
                logging: configService.get<string>('LOG_ENABLED')?.toLowerCase() === 'true',
                synchronize: false,
                useUTC: true,
                migrations: [
                    ...options.migrations
                ],
                migrationsTableName: 'MigrationHistory',
                namingStrategy: new SnakeNamingStrategy(),
                autoLoadEntities: true,
                migrationsRun: true,
            }),
            async dataSourceFactory(options) {
                if (!options) {
                  throw new Error('Invalid options passed');
                }
     
                return getDataSourceByName('default') || addTransactionalDataSource(new DataSource(options));
              },
        });

        return {
            module: DatabaseModule,
            imports: [typeOrmModule]
        }
    };
}
