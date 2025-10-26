import { Provider } from "@nestjs/common";
import { IShipmentLaneKeySettingsService, SHIPMENT_LANE_KEY_SETTINGS_SERVICE } from "@src/w-hra-modules/shipment-lanes/services/shipment-lane-key-settings";
import { ShipmentLaneKeySettingsService } from "./shipment-lane-key-settings.service";


export const overrideShipmentLaneKeySettingsServiceProvider: Provider<IShipmentLaneKeySettingsService> = {
    provide: SHIPMENT_LANE_KEY_SETTINGS_SERVICE,
    useClass: ShipmentLaneKeySettingsService
};