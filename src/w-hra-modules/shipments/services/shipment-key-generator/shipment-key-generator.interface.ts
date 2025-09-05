

export const SHIPMENT_KEY_GENERATOR_SYMBOL = 'SHIPMENT_KEY_GENERATOR';

export interface IShipmentKeyGenerator {
    generate(): Promise<string>;
}