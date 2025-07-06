import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignatureSchema, ESignatureSchema, PaymentSignatureSchema } from "./persistence/schemas/signature.schemas";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            SignatureSchema,
            ESignatureSchema,
            PaymentSignatureSchema,
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [
        TypeOrmModule
    ],
})
export class TariffsModule {}