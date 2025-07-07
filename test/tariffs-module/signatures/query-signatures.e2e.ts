import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Signature, ESignature, PaymentSignature, SignatureType } from "@src/tariffs/domain/models/signatures";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";


describe('TariffsModule - Query Signatures E2E', () => {
    let signatureRepository: Repository<Signature>;
    let eSignatureRepository: Repository<ESignature>;
    let paymentSignatureRepository: Repository<PaymentSignature>;

    let eSignatures: ESignature[];
    let paymentSignatures: PaymentSignature[];

    beforeAll(async () => {
        signatureRepository = app.get(getRepositoryToken(Signature));
        eSignatureRepository = app.get(getRepositoryToken(ESignature));
        paymentSignatureRepository = app.get(getRepositoryToken(PaymentSignature));

        eSignatures = faker.helpers.multiple(() => {
            const eSignature = new ESignature();
            eSignature.signedBy = faker.person.fullName();
            eSignature.imageUrl = faker.image.url();
            return eSignature;
        }, { count: 5 });

        paymentSignatures = faker.helpers.multiple(() => {
            const paymentSignature = new PaymentSignature();
            paymentSignature.signedBy = faker.person.fullName();
            paymentSignature.transactionId = faker.string.alphanumeric(10).toUpperCase();
            return paymentSignature;
        }, { count: 5 });

        await eSignatureRepository.save(eSignatures);
        await paymentSignatureRepository.save(paymentSignatures);
    });

    afterAll(async () => {
        await signatureRepository.delete({});
        await eSignatureRepository.delete({});
        await paymentSignatureRepository.delete({});
    });

    it(`should query all ${ESignature.name} signatures successfully`, async () => {
        const queriedSignatures = await eSignatureRepository.find();
        expect(queriedSignatures).toHaveLength(eSignatures.length);
        queriedSignatures.forEach((signature, index) => {
            expect(signature.signedBy).toBe(eSignatures[index].signedBy);
            expect(signature.imageUrl).toBe(eSignatures[index].imageUrl);
            expect(signature.signatureType).toBe(SignatureType.E_SIGNATURE);
        });
    });

    it(`should query all ${PaymentSignature.name} signatures successfully`, async () => {
        const queriedSignatures = await paymentSignatureRepository.find();
        expect(queriedSignatures).toHaveLength(paymentSignatures.length);
        queriedSignatures.forEach((signature, index) => {
            expect(signature.signedBy).toBe(paymentSignatures[index].signedBy);
            expect(signature.transactionId).toBe(paymentSignatures[index].transactionId);
            expect(signature.signatureType).toBe(SignatureType.PAYMENT_SIGNATURE);
        });
    });

    it(`should query all ${Signature.name} signatures successfully`, async () => {
        const queriedSignatures = await signatureRepository.find();
        expect(queriedSignatures).toHaveLength(eSignatures.length + paymentSignatures.length);
        
        const eSignatureIds = eSignatures.map(sig => sig.id);
        const paymentSignatureIds = paymentSignatures.map(sig => sig.id);

        queriedSignatures.forEach(signature => {
            if (eSignatureIds.includes(signature.id)) {
                expect(signature.signatureType).toBe(SignatureType.E_SIGNATURE);
            } else if (paymentSignatureIds.includes(signature.id)) {
                expect(signature.signatureType).toBe(SignatureType.PAYMENT_SIGNATURE);
            } else {
                throw new Error("Signature not found in either ESignature or PaymentSignature arrays");
            }
        });
    });
});