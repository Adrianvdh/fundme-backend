import { MongoDict } from '@/config/databases/types';
import { Contract } from '@/modules/contracts/models/contract.interface';

export interface IContractRepository {
    find(filter: MongoDict): Promise<Contract>;

    findOneById(contractId: string): Promise<Contract>;
}
