import { CreateBizUnitHandler } from "./create/create-biz-unit.handler";

const CqrsCommandHandlers = [
    CreateBizUnitHandler,
];

export const BizUnitsModulesCqrsCommandHandlers = [
    ...CqrsCommandHandlers,
    ...CqrsCommandHandlers.map(h => ({
        provide: h.name,
        useExisting: h
    }))
];



export * from "./create/create-biz-unit.payload";
export * from "./create/create-biz-unit.command";