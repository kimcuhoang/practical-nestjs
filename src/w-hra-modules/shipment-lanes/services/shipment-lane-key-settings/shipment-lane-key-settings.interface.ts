export const SHIPMENT_LANE_KEY_SETTINGS_SERVICE = "SHIPMENT_LANE_KEY_SETTINGS_SERVICE";

export interface IShipmentLaneKeySettingsService {
    loadShipmentLaneKeySettings(): Promise<void>;
    get prefix(): string;
    get template(): string;
}