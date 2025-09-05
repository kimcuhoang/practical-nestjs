import { SaleOrder } from "../../domain";

export const SaleOrderCreationValidationServiceSymbol = "ISaleOrderCreationValidationService";

export interface ISaleOrderCreationValidationService {
    canCreateSaleOrder(saleOrder: SaleOrder): Promise<boolean>;
}

export class DefaultSaleOrderCreationValidationService implements ISaleOrderCreationValidationService {
    public async canCreateSaleOrder(saleOrder: SaleOrder): Promise<boolean> {
        return await new Promise((resolve) => {
            const isValid = saleOrder
                        && !!saleOrder.saleOrderCode
                        && !!saleOrder.regionCode
                        && !!saleOrder.items.length;
            return resolve(isValid);
        });
    }
}