import { Provider } from "@nestjs/common";
import { IShipmentAssignmentService, SHIPMENT_ASSIGNMENT_SERVICE } from "@src/w-hra-modules/shipments/services/sale-orders";
import { shipmentAssignmentService } from "./shipment-assignment.service";
import { IShipmentKeyGenerator, SHIPMENT_KEY_GENERATOR_SYMBOL } from "@src/w-hra-modules/shipments/services/shipment-key-generator";
import { ShipmentKeyGeneratorService } from "./shipment-key-generator.service";


export const overrideShipmentAssigmentServiceProvider: Provider<IShipmentAssignmentService> = {
    provide: SHIPMENT_ASSIGNMENT_SERVICE,
    useClass: shipmentAssignmentService
};

export const overrideShipmentKeyGeneratorServiceProvider: Provider<IShipmentKeyGenerator> = {
    provide: SHIPMENT_KEY_GENERATOR_SYMBOL,
    useClass: ShipmentKeyGeneratorService
};