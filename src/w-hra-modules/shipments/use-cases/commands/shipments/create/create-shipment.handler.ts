import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateShipmentCommand } from "./create-shipment.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Shipment } from "@src/w-hra-modules/shipments/domain";
import { Repository } from "typeorm";

@CommandHandler(CreateShipmentCommand)
export class CreateShipmentHandler implements ICommandHandler<CreateShipmentCommand, string> {

    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>,
    ) { }

    public async execute(command: CreateShipmentCommand): Promise<string> {
        const payload = command.payload;

        const shipment = new Shipment(s => {
            s.shipmentCode = payload.shipmentCode;
            s.bizUnitCode = payload.bizUnitCode;
            s.regionCode = payload.regionCode;
            s.startFromDateTime = payload.startFromDateTime;
            s.finishToDateTime = payload.finishToDateTime;
            s.sourceGeographyCode = payload.sourceGeographyCode;
            s.destinationGeographyCode = payload.destinationGeographyCode;

            for (const saleOrder of payload.saleOrders) {
                s.addSaleOrder(so => {
                    so.saleOrderCode = saleOrder.saleOrderCode;
                    so.sourceGeographicalKey = saleOrder.sourceGeographicalKey;
                    so.destinationGeographicalKey = saleOrder.destinationGeographicalKey;

                    for (const item of saleOrder.items) {
                        so.addItem(i => {
                            i.productCode = item.productCode;
                            i.quantity = item.quantity;
                        });
                    }
                });
            }
        });

        const saveShipmentResult = await this.shipmentRepository.save(shipment);
        return saveShipmentResult.id;
    }
}