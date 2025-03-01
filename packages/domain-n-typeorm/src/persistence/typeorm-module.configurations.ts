import { ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DatabaseOptions, DefaultDatasourceOptions } from "./typeorm-datasource.configurations";

export const TypeOrmModuleConfigure = (configure: (configService: ConfigService) => DatabaseOptions) => {
    return TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
            return {
                ...DefaultDatasourceOptions,
                ...configure(configService)
            } as TypeOrmModuleOptions;
        }
    });
}
