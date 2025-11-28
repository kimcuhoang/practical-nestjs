import { Provider } from "@nestjs/common";
import { DefaultShipmentKeyGenerator } from "./shipment-key-generator.default";
import { IShipmentKeyGenerator, SHIPMENT_KEY_GENERATOR_SYMBOL } from "./shipment-key-generator.interface";

export const defaultShipmentKeyGeneratorProvider: Provider<IShipmentKeyGenerator> = {
    provide: SHIPMENT_KEY_GENERATOR_SYMBOL,
    useClass: DefaultShipmentKeyGenerator
};

export {
    IShipmentKeyGenerator,
    SHIPMENT_KEY_GENERATOR_SYMBOL,
    DefaultShipmentKeyGenerator
};