import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseConfigurableModuleClass, DatabaseModuleOptions } from './database.module-definition';
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

@Global()
@Module({})
export class DatabaseModule extends DatabaseConfigurableModuleClass {

    public static register(options: DatabaseModuleOptions): DynamicModule {
        const typeOrmModuleOptions: TypeOrmModuleOptions = {
            type: 'postgres',
            url: options.databaseUrl,
            synchronize: false,
            migrations: [
                ...options.migrations
            ],
            migrationsTableName: 'MigrationHistory',
            autoLoadEntities: true,
            migrationsRun: true,
            logging: true
        };

        return {
            module: DatabaseModule,
            imports: [ TypeOrmModule.forRoot(typeOrmModuleOptions) ],
            exports: [TypeOrmModule]
        }
    };

    // public static register(options: DatabaseModuleOptions): DynamicModule {
    //     const moduleDefinition = super.register(options);
    //     moduleDefinition.providers = moduleDefinition.providers || [];
    //     moduleDefinition.exports = moduleDefinition.exports || [];
    //     moduleDefinition.imports = moduleDefinition.imports || [];

    //     const typeOrmModuleOptions: TypeOrmModuleOptions = {
    //         type: 'postgres',
    //         url: options.databaseUrl,
    //         synchronize: false,
    //         entities: [
    //             'dist/infra/database/schemas/*.schema.js'
    //         ],
    //         migrations: [
    //             'dist/infra/database/migrations/*.js'
    //         ],
    //         migrationsTableName: 'MigrationHistory',
    //         autoLoadEntities: true,
    //         migrationsRun: true,
    //         logging: true
    //     };

    //     moduleDefinition.imports.push(TypeOrmModule.forRoot(typeOrmModuleOptions));

    //     return moduleDefinition;
    // }
}
