import { CreateBizPartnerHandler } from "./create/create-biz-partner.handler";


export const BizPartnersModuleCommandHandlers = [
    CreateBizPartnerHandler
];


export * from "./create/payloads";
export * from "./create/create-biz-partner.command";