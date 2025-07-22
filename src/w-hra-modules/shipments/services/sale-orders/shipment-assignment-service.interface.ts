
export const SHIPMENT_ASSIGNMENT_SERVICE = Symbol('SHIPMENT_ASSIGNMENT_SERVICE');

export interface IShipmentAssignmentService {
    ensureSaleOrdersIsValid(saleOrderKeys: string[]): Promise<string[]>;
    assignShipmentToSaleOrders(shipmentKey: string, saleOrderKeys: string[]): Promise<void>;
}