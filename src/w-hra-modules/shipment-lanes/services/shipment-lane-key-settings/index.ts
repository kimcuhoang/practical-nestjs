import { Provider } from "@nestjs/common";
import { IShipmentLaneKeySettingsService, SHIPMENT_LANE_KEY_SETTINGS_SERVICE } from "./shipment-lane-key-settings.interface";
import { DefaultShipmentLaneKeySettingsService } from "./default-shipment-lane-key-settings.service";


export const DefaultShipmentLaneKeySettingsProvider: Provider<IShipmentLaneKeySettingsService> = {
    provide: SHIPMENT_LANE_KEY_SETTINGS_SERVICE,
    useClass: DefaultShipmentLaneKeySettingsService
};

export {
    IShipmentLaneKeySettingsService,
    SHIPMENT_LANE_KEY_SETTINGS_SERVICE,
    DefaultShipmentLaneKeySettingsService
}