import { InjectRepository } from "@nestjs/typeorm";
import { BizUnit } from "@src/w-hra-modules/biz-units/domain";
import { SaleOrder } from "@src/w-hra-modules/sale-orders/domain";
import { DefaultSaleOrderCreationValidationService } from "@src/w-hra-modules/sale-orders/services";
import { Equal, Repository } from "typeorm";


export class SaleOrderCreationValidationService extends DefaultSaleOrderCreationValidationService {

    constructor(
        @InjectRepository(BizUnit)
        private readonly bizUnitRepository: Repository<BizUnit>
    ){
        super();
    }

    public async canCreateSaleOrder(saleOrder: SaleOrder): Promise<boolean> {
        const isValid = await super.canCreateSaleOrder(saleOrder);
        if (!isValid) {
            return false;
        }

        const bizUnit = await this.bizUnitRepository.findOne({
            where: {
                regions: {
                    regionCode: Equal(saleOrder.regionCode)
                }
            },
            relations: {
                regions: true
            }
        });

        return !!bizUnit;
    }
}