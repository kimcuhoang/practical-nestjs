import { BizPartnerCommunicationSchema } from "./schemas/biz-partner-communication.schema";
import { BizPartnerCustomerRegionSchema } from "./schemas/biz-partner-customer-region.schema";
import { BizPartnerCustomerSchema } from "./schemas/biz-partner-customer.schema";
import { BizPartnerVendorRegionSchema } from "./schemas/biz-partner-vendor-region.schema";
import { BizPartnerVendorSchema } from "./schemas/biz-partner-vendor.schema";
import { BizPartnerSchema } from "./schemas/biz-partner.schema";


export const BizPartnersModuleSchemas = [
    BizPartnerSchema,
    BizPartnerCommunicationSchema,
    BizPartnerCustomerSchema,
    BizPartnerCustomerRegionSchema,
    BizPartnerVendorSchema,
    BizPartnerVendorRegionSchema
];