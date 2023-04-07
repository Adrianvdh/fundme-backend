import { MongoDict } from '@/config/databases/types';
import { Contract, IContractDeployment, IContractDetails } from '@/modules/contracts/models/contract.interface';

export interface IContractRepository {
    find(filter: MongoDict): Promise<Contract>;

    findOneById(contractId: string): Promise<Contract>;

    create(contract: IContractDetails): Promise<Contract>;

    updateDeploymentDetails(contractId: string, contract: IContractDeployment): Promise<Contract>;

    markAsFailed(contractId: string, status: Pick<Contract, 'deployed' | 'status'>): Promise<Contract>;
}
