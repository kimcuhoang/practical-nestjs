import { faker } from "@faker-js/faker";
import { CommandBus } from "@nestjs/cqrs";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BizPartner } from "@src/new-sources/m-biz-partners/models";
import { IBizPartnerVerificationService, IBizPartnerVerificationServiceSymbol } from "@src/new-sources/m-biz-partners/services/biz-partner-verification.service";
import { CreateBizPartnerCommand, CreateBizPartnerLocationPayload, CreateBizPartnerPayload } from "@src/new-sources/m-biz-partners/usecases/commands/create-biz-partner/create-biz-partner.command";
import { CustomBizPartnerVerificationService } from "@src/new-sources/m-main-app/services/custom-biz-partner-verification.service";
import { app } from "@test/test.setup";
import { Repository } from "typeorm";


describe(`Create ${BizPartner.name} via command`, () => {
    let bizPartnerRepository: Repository<BizPartner>;
    let bizPartnerVerificationService: IBizPartnerVerificationService;
    let commandBus: CommandBus;

    beforeAll(() => {
        bizPartnerRepository = app.get(getRepositoryToken(BizPartner));
        commandBus = app.get(CommandBus);
        bizPartnerVerificationService = app.get(IBizPartnerVerificationServiceSymbol);

        expect(bizPartnerVerificationService).toBeInstanceOf(CustomBizPartnerVerificationService);
    })

    afterEach(async() => {
        await bizPartnerRepository.delete({});
    })

    test("without biz partner key should be failed", async () => {
        const payload  = {
            bizPartnerKey: "",
            name: faker.company.name(),
            locations: faker.helpers.multiple(() => {
                return {
                    locationKey: faker.string.alphanumeric(10).toUpperCase(),
                    address: faker.location.streetAddress({ useFullAddress: true })
                } satisfies CreateBizPartnerLocationPayload
            }, { count: 4 })
        } satisfies CreateBizPartnerPayload;

        await expect(commandBus.execute(new CreateBizPartnerCommand(payload))).rejects.toThrow("BizPartnerKey is required");
    });

    test.each(["ABC", "DEF", "GHI"])("should be success when biz partner key starts with %s", async (prefix) => {
        const payload  = {
            bizPartnerKey: `${prefix}${faker.string.alphanumeric(10).toUpperCase()}`,
            name: faker.company.name(),
            locations: faker.helpers.multiple(() => {
                return {
                    locationKey: faker.string.alphanumeric(10).toUpperCase(),
                    address: faker.location.streetAddress({ useFullAddress: true })
                } satisfies CreateBizPartnerLocationPayload
            }, { count: 4 })
        } satisfies CreateBizPartnerPayload;

        const bizPartnerId = await commandBus.execute(new CreateBizPartnerCommand(payload));
        expect(bizPartnerId).toBeTruthy();

        const bizPartner = await bizPartnerRepository.findOne({
            where: { id: bizPartnerId },
            relations: {
                locations: true
            }
        });
        expect(bizPartner).toBeTruthy();
        expect(bizPartner.name).toBe(payload.name);
        expect(bizPartner.bizPartnerKey).toBe(payload.bizPartnerKey);
        expect(bizPartner.locations).toHaveLength(payload.locations.length);
    });
        

    test.each([
        ["XYZ", "The Business-Partner-Key has not been allowed to add"],
        ["123", "The Business-Partner-Key has not been allowed to add"],
        ["LMN", "The Business-Partner-Key has not been allowed to add"]
    ])(
        "should be failed when biz partner key does not start with %s",
        async (prefix, expectedError) => {
            const payload  = {
                bizPartnerKey: `${prefix}${faker.string.alphanumeric(10).toUpperCase()}`,
                name: faker.company.name(),
                locations: faker.helpers.multiple(() => {
                    return {
                        locationKey: faker.string.alphanumeric(10).toUpperCase(),
                        address: faker.location.streetAddress({ useFullAddress: true })
                    } satisfies CreateBizPartnerLocationPayload
                }, { count: 4 })
            } satisfies CreateBizPartnerPayload;

            await expect(commandBus.execute(new CreateBizPartnerCommand(payload))).rejects.toThrow(expectedError);
        }
    );
        
});