import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateShipmentCommand } from "./create-shipment.command";
import { InjectRepository } from "@nestjs/typeorm";
import { Shipment, ShipmentStatus } from "@src/w-hra-modules/shipments/domain";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import { IShipmentAssignmentService, SHIPMENT_ASSIGNMENT_SERVICE } from "@src/w-hra-modules/shipments/services/sale-orders/shipment-assignment-service.interface";
import { Transactional } from "typeorm-transactional";
import { IShipmentKeyGenerator, SHIPMENT_KEY_GENERATOR_SYMBOL } from "@src/w-hra-modules/shipments/services/shipment-key-generator";

@CommandHandler(CreateShipmentCommand)
export class CreateShipmentHandler implements ICommandHandler<CreateShipmentCommand, string> {

    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentRepository: Repository<Shipment>,
        @Inject(SHIPMENT_ASSIGNMENT_SERVICE)
        private readonly shipmentAssignmentService: IShipmentAssignmentService,
        @Inject(SHIPMENT_KEY_GENERATOR_SYMBOL)
        private readonly shipmentKeyGenerator: IShipmentKeyGenerator
    ) { }

    @Transactional()
    public async execute(command: CreateShipmentCommand): Promise<string> {
        const payload = command.payload;

        const saleOrderKeys = payload.saleOrders.map(so => so.saleOrderCode);

        const invalidSaleOrders = await this.shipmentAssignmentService.ensureSaleOrdersIsValid(saleOrderKeys);
        if (invalidSaleOrders.length > 0) {
            throw new Error(`Invalid sale orders: ${invalidSaleOrders.join(", ")}`);
        }

        const shipmentCode = await this.shipmentKeyGenerator.generate();

        const shipment = new Shipment(s => {
            s.shipmentCode = shipmentCode;
            s.bizUnitCode = payload.bizUnitCode;
            s.regionCode = payload.regionCode;
            s.startFromDateTime = payload.startFromDateTime;
            s.finishToDateTime = payload.finishToDateTime;
            s.sourceGeographyCode = payload.sourceGeographyCode;
            s.destinationGeographyCode = payload.destinationGeographyCode;
            s.status = ShipmentStatus.STATUS0;

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
        await this.shipmentAssignmentService.assignShipmentToSaleOrders(saveShipmentResult.shipmentCode, saleOrderKeys);
        return saveShipmentResult.id;
    }
}