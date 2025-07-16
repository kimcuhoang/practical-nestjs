import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShipmentsModuleSchemas } from "./persistence";
import { CqrsCommandHandlers } from "./use-cases/commands";


@Module({})
export class ShipmentsModule {
    public static forRoot(): DynamicModule {
        return {
            module: ShipmentsModule,
            imports: [
                TypeOrmModule.forFeature([
                    ...ShipmentsModuleSchemas
                ])
            ],
            providers: [
                ...CqrsCommandHandlers
            ],
            exports: [
                TypeOrmModule,
                ...CqrsCommandHandlers
            ]
        } as DynamicModule;
    }
}