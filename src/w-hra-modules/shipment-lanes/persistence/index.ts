import { ShipmentLaneSchema } from "./schemas/shipment-lane.schema";
import { BaseRateValueSchema } from "./schemas/tariffs/base-rates/base-rate-value.schema";
import { BaseRateSchema } from "./schemas/tariffs/base-rates/base-rate.schema";
import { WeightRateValueSchema } from "./schemas/tariffs/base-rates/weight-rates/weight-rate-value.schema";
import { WeightRateSchema } from "./schemas/tariffs/base-rates/weight-rates/weight-rate.schema";
import { TariffValiditySchema } from "./schemas/tariffs/tariff-validity.schema";
import { TariffSchema } from "./schemas/tariffs/tariff.schema";
import { ShipmentLaneSubscriber } from "./subscribers/shipment-lane.subscriber";


export const ShipmentLanesModuleSchemas  = {
    ShipmentLaneSchema,
    TariffSchema,
    TariffValiditySchema,
    BaseRateSchema,
    BaseRateValueSchema,
    WeightRateSchema,
    WeightRateValueSchema
};

export const ShipmentLanesModuleEntitySubscribers = {
    ShipmentLaneSubscriber
};

export * from "./sequences";