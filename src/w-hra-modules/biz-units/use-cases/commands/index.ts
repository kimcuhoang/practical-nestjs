import { CreateBizUnitHandler } from "./create/create-biz-unit.handler";

const CqrsCommandHandlers = [
    CreateBizUnitHandler,
];

export const BizUnitsModulesCqrsCommandHandlers = [
    ...CqrsCommandHandlers
];



export * from "./create/create-biz-unit.payload";
export * from "./create/create-biz-unit.command";