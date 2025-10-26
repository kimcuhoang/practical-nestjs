import { IShipmentKeyGenerator } from "./shipment-key-generator.interface";


export class DefaultShipmentKeyGenerator implements IShipmentKeyGenerator {
    
    public async generate(): Promise<string> {
        return await Promise.resolve(`SHIP-${Date.now()}`);
    }
}