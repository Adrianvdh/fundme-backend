import { Contract, IContractDeployment, IContractDetails } from '@/modules/contracts/models/contract.interface';
import { ContractConnectorDetails } from '@/modules/contracts/contracts/model/contract.model';

export interface IContractRepository {
    findOneById(contractId: string): Promise<Contract>;

    findOneContractConnectorDetailsById(contractId: string): Promise<ContractConnectorDetails>;

    create(contract: IContractDetails): Promise<Contract>;

    updateDeploymentDetails(contractId: string, contract: IContractDeployment): Promise<Contract>;

    markAsFailed(contractId: string, status: Pick<Contract, 'deployed' | 'status'>): Promise<Contract>;
}
