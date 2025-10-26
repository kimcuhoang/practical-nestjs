import { Injectable } from "@nestjs/common";
import { IShipmentLaneKeySettingsService } from "./shipment-lane-key-settings.interface";


@Injectable()
export class DefaultShipmentLaneKeySettingsService implements IShipmentLaneKeySettingsService {

    public async loadShipmentLaneKeySettings(): Promise<void> {
        await Promise.resolve();
    }

    get prefix(): string {
        return "LANE";
    }
    get template(): string {
        return "##########";
    }
}