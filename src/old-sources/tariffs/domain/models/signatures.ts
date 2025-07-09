import { EntityBase } from "@src/building-blocks/domains/entity-base";
import { ulid } from "ulidx";

export enum SignatureType {
    E_SIGNATURE = "E_SIGNATURE",
    PAYMENT_SIGNATURE = "PAYMENT_SIGNATURE",
}

export class Signature extends EntityBase {
    signedBy!: string;
    readonly signatureType!: SignatureType;

    constructor(id?: string) {
        super(id ?? ulid());
    }
}

export class ESignature extends Signature {
    imageUrl: string;
    signatureType: SignatureType.E_SIGNATURE;

    constructor() {
        super();
    }
}

export class PaymentSignature extends Signature {
    transactionId: string;
    signatureType: SignatureType.PAYMENT_SIGNATURE;
    
    constructor() {
        super();
    }
}