import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnEntity } from "./entities";


@Module({
    imports: [ TypeOrmModule.forFeature([AnEntity]) ],
    exports: [ TypeOrmModule ]
})
export class SampleAppModule { }