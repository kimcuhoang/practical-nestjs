import { CreateBizPartnerHandler } from "./create-biz-partner/create-biz-partner.handler";

export const CqrsCommandHandlers = [
    CreateBizPartnerHandler
];

export * from "./create-biz-partner/create-biz-partner.command";

