# Shipment Lanes Domain - Class Diagram

This class diagram represents the domain model for the shipment lanes module, showing the relationships between entities for managing shipping lanes, tariffs, and rate calculations.

```mermaid
---
title: Shipment Lanes Domain - Class Diagram
---

classDiagram
    %% Main Domain Classes
    class ShipmentLane {
        +string code
        +string description
        +Tariff[] tariffs
        +constructor()
        +addTariff(option): Tariff
    }

    class Tariff {
        +string code
        +string bizPartnerCode
        +boolean preferred
        +string shipmentLaneId
        +ShipmentLane shipmentLane
        +TariffValidity[] validities
        +constructor(shipmentLane?, tariff?)
        +addValidity(validity): TariffValidity
    }

    class TariffValidity {
        +string tariffId
        +Tariff tariff
        +Date validFrom
        +Date validTo
        +BaseRate[] baseRates
        +constructor(tariff?, validity?)
        +addBaseRate(baseRate): void
    }

    %% Abstract Base Rate Classes
    class BaseRate {
        <<abstract>>
        +string tariffValidityId
        +TariffValidity tariffValidity
        +BaseRateType baseRateType*
        +BaseRateValue[] values
        +constructor(tariffValidity?)
        +addBaseRateValue(baseRateValue): void
    }

    class BaseRateValue {
        <<abstract>>
        +BaseRate baseRate
        +string baseRateId
        +BaseRateType baseRateType
        +number value
        +constructor(baseRate?, options?)
    }

    %% Concrete Rate Classes
    class LaneRate {
        +BaseRateType baseRateType = LANE
        +constructor(tariffValidity?)
    }

    class WeightRate {
        +BaseRateType baseRateType = WEIGHT
        +constructor(tariffValidity?)
    }

    class StopRate {
        +BaseRateType baseRateType = STOP
        +constructor(tariffValidity?)
    }

    %% Concrete Rate Value Classes  
    class LaneRateValue {
        +constructor(baseRate?, options?)
    }

    class WeightRateValue {
        +number perSegment
        +string segmentUnit
        +constructor(baseRate?, options?)
    }

    class StopRateValue {
        +number perNumberOfStops
        +constructor(baseRate?, options?)
    }

    %% Enumeration
    class BaseRateType {
        <<enumeration>>
        WEIGHT
        STOP
        LANE
    }

    %% Inheritance Relationships
    BaseRate <|-- LaneRate
    BaseRate <|-- WeightRate
    BaseRate <|-- StopRate
    
    BaseRateValue <|-- LaneRateValue
    BaseRateValue <|-- WeightRateValue
    BaseRateValue <|-- StopRateValue

    %% Composition and Association Relationships
    ShipmentLane "1" *-- "*" Tariff : has
    Tariff "1" *-- "*" TariffValidity : has
    TariffValidity "1" *-- "*" BaseRate : has
    BaseRate "1" *-- "*" BaseRateValue : has
    
    %% Dependencies
    BaseRate ..> BaseRateType : uses
    BaseRateValue ..> BaseRateType : uses

    %% Notes
    note for ShipmentLane "Root aggregate for shipping lanes with tariff management"
    note for BaseRate "Strategy pattern for different rate calculation types"
    note for BaseRateValue "Value objects for rate calculations with specific properties"
```

## Key Design Patterns

### 1. **Domain-Driven Design (DDD)**
- `ShipmentLane` serves as the aggregate root
- Encapsulates business logic for managing tariffs and rates
- Clear boundaries between domain entities

### 2. **Strategy Pattern**
- `BaseRate` and its concrete implementations (`LaneRate`, `WeightRate`, `StopRate`)
- Different rate calculation strategies for various pricing models
- `BaseRateType` enum defines the available strategies

### 3. **Value Objects**
- Rate value classes contain specific calculation parameters
- Immutable data structures for rate calculations
- Each rate type has its own value object with specific properties

### 4. **Composition over Inheritance**
- Strong composition relationships between aggregates
- Clear ownership and lifecycle management
- Enforced through constructor parameters and factory methods

## Entity Relationships

1. **ShipmentLane** → **Tariff**: A shipping lane can have multiple tariffs from different business partners
2. **Tariff** → **TariffValidity**: Each tariff can have multiple validity periods
3. **TariffValidity** → **BaseRate**: Each validity period can have different types of rates
4. **BaseRate** → **BaseRateValue**: Each rate type can have multiple value configurations

## Rate Calculation Types

- **Lane Rate**: Fixed rates per lane with stops consideration
- **Weight Rate**: Rates based on weight segments (kg/lb)
- **Stop Rate**: Rates based on number of stops in the route