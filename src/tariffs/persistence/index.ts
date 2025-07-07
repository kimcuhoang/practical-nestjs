import { ESignatureSchema, PaymentSignatureSchema, SignatureSchema } from "./schemas/signature.schemas";
import { SurchargeSchema } from "./schemas/surcharge.schemas";
import { StandardChargeValiditySchema, TariffSchema } from "./schemas/tariff.schemas";


export const TariffSchemas = [
    SignatureSchema,
    ESignatureSchema,
    PaymentSignatureSchema,
    TariffSchema,
    StandardChargeValiditySchema,
    SurchargeSchema,
]
