import { EntityBaseSchema } from "@src/building-blocks/infra/database/schemas/entity-base-schema";
import { ESignature, PaymentSignature, Signature, SignatureType } from "@src/new-sources/tariffs/domain/models/signatures";
import { EntitySchema } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";


export const SignatureSchema = new EntitySchema<Signature>({
    target: Signature, // very important to specify the target entity
    name: Signature.name,
    tableName: snakeCase("Signatures"),
    columns: {
        ...EntityBaseSchema,
        signedBy: {
            type: String,
            nullable: false,
            length: 255
        },
        signatureType: {
            type: String,
            length: 50,
        }
    },
    inheritance: {
        pattern: "STI", // Single Table Inheritance
        column: "signatureType", // Column that will hold the type of the entity
    }
});

export const ESignatureSchema = new EntitySchema<ESignature>({
    target: ESignature, // very important to specify the target entity
    name: ESignature.name,
    type: "entity-child",
    discriminatorValue: SignatureType.E_SIGNATURE,
    columns: {
        ...SignatureSchema.options.columns,
        imageUrl: {
            type: String,
            nullable: false,
            length: 255
        }
    }
});

export const PaymentSignatureSchema = new EntitySchema<PaymentSignature>({
    target: PaymentSignature, // very important to specify the target entity
    name: PaymentSignature.name,
    type: "entity-child",
    discriminatorValue: SignatureType.PAYMENT_SIGNATURE,
    columns: {
        ...SignatureSchema.options.columns,
        transactionId: {
            type: String,
            nullable: false,
            length: 255
        }
    }
});