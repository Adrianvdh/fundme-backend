import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from '@/shared/http/httpResponse';
import { ContractService } from '@/modules/contracts/service/contract.service';
import { ContractResponse } from '@/modules/contracts/api/contract.model';

class ContractController {
    constructor(private contractService: ContractService) {}

    public getContractById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const contractId: string = req.params.id;
            const contractResponse: ContractResponse = await this.contractService.getContractById(contractId);

            return HttpResponse.ok(res, contractResponse);
        } catch (error) {
            next(error);
        }
    };
}

export default ContractController;
