import { IEvent } from "@nestjs/cqrs";


export class ShipmentAssignedEvent implements IEvent {
  constructor(
    public readonly saleOrderCode: string,
    public readonly shipmentCode: string,
    public readonly assignedAt: Date
  ) {}
}