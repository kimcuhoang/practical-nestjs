import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseConfigurableModuleClass, DatabaseModuleOptions } from './database.module-definition';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Global()
@Module({})
export class DatabaseModule extends DatabaseConfigurableModuleClass {

    public static register(options: DatabaseModuleOptions): DynamicModule {

        const typeOrmModule = TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'),
                synchronize: false,
                migrations: [
                    ...options.migrations
                ],
                migrationsTableName: 'MigrationHistory',
                namingStrategy: new SnakeNamingStrategy(),
                autoLoadEntities: true,
                migrationsRun: true,
                logging: true
            })
        });

        return {
            module: DatabaseModule,
            imports: [typeOrmModule],
            exports: [TypeOrmModule]
        }
    };
}
