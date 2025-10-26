

export const SHIPMENT_KEY_GENERATOR_SYMBOL = 'SHIPMENT_KEY_GENERATOR';

export interface IShipmentKeyGenerator {
    get shipmentKeyPrefix(): string;
    get shipmentKeyTemplate(): string;
    get shipmentKeySequenceEnd(): number;

    loadSettings(): Promise<void>;

    generate(): Promise<string>;
}