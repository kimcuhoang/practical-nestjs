import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomersModuleSchemas } from "./persistence";
import { CustomersModuleCommandHandlers } from "./use-cases/commands";
import { CustomersModuleQueryHandlers } from "./use-cases/queries";


@Module({})
export class CustomersModule {
    public static forRoot(): DynamicModule {
        return {
            module: CustomersModule,
            imports: [
                TypeOrmModule.forFeature(CustomersModuleSchemas)
            ],
            providers: [
                ...CustomersModuleCommandHandlers,
                ...CustomersModuleQueryHandlers
            ],
            exports: [
                TypeOrmModule,
                ...CustomersModuleCommandHandlers,
                ...CustomersModuleQueryHandlers
            ]
        } as DynamicModule;
    }
}