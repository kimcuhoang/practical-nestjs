import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SaleOrderModuleSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./use-cases/commands";


@Module({})
export class SaleOrdersModule {
    public static forRoot(): DynamicModule {
        return {
            module: SaleOrdersModule,
            imports: [
                TypeOrmModule.forFeature([ ...SaleOrderModuleSchemas ])
            ],
            providers: [
                ...CqrsCommandHandlers
            ],
            exports: [
                TypeOrmModule
            ]
        } as DynamicModule;
    }
}