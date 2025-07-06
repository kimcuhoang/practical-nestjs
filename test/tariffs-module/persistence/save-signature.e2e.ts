import { faker } from "@faker-js/faker";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ESignature, PaymentSignature, Signature, SignatureType } from "@src/tariffs/domain/models/signatures";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";


describe('TariffsModule - Save Signature E2E', () => {
    let signatureRepository: Repository<Signature>;
    let eSignatureRepository: Repository<ESignature>;
    let paymentSignatureRepository: Repository<PaymentSignature>;

    beforeAll(() => {
        signatureRepository = app.get(getRepositoryToken(Signature));
        eSignatureRepository = app.get(getRepositoryToken(ESignature));
        paymentSignatureRepository = app.get(getRepositoryToken(PaymentSignature));
    });

    afterEach(async () => {
        await signatureRepository.delete({});
        await eSignatureRepository.delete({});
        await paymentSignatureRepository.delete({});
    });

    it(`should save a ${ESignature.name} successfully`, async () => {
        const eSignature = new ESignature();
        eSignature.signedBy = faker.person.fullName();
        eSignature.imageUrl = faker.image.url();

        await eSignatureRepository.save(eSignature);

        const savedSignature = await eSignatureRepository.findOneBy({ id: eSignature.id });
        expect(savedSignature).toBeTruthy();
        expect(savedSignature?.signedBy).toBe(eSignature.signedBy);
        expect(savedSignature?.imageUrl).toBe(eSignature.imageUrl);
        expect(savedSignature?.signatureType).toBe(SignatureType.E_SIGNATURE);
    });

    it(`should save a ${PaymentSignature.name} successfully`, async () => {
        const paymentSignature = new PaymentSignature();
        paymentSignature.signedBy = faker.person.fullName();
        paymentSignature.transactionId = faker.string.alphanumeric(10).toUpperCase();

        await paymentSignatureRepository.save(paymentSignature);

        const savedSignature = await paymentSignatureRepository.findOneBy({ id: paymentSignature.id });
        expect(savedSignature).toBeTruthy();
        expect(savedSignature?.signedBy).toBe(paymentSignature.signedBy);
        expect(savedSignature?.transactionId).toBe(paymentSignature.transactionId);
        expect(savedSignature?.signatureType).toBe(SignatureType.PAYMENT_SIGNATURE);
    });
});