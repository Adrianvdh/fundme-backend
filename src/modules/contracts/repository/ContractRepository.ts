import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { MongoConnection } from '@/config/databases/mongodb';
import { MongoDict } from '@/config/databases/types';
import { DatabaseConnection } from '@/config/databases/connection';
import { IContractRepository } from '@/modules/contracts/repository/IContractRepository';
import { Contract, IContractDeployment, IContractDetails } from '@/modules/contracts/models/contract.interface';

export class ContractRepository implements IContractRepository {
    private readonly contracts: mongodb.Collection<Contract>;

    constructor(private databaseConnection: DatabaseConnection) {
        this.contracts = (this.databaseConnection as MongoConnection).db.collection<Contract>('contracts');
    }

    async find(filter: MongoDict): Promise<Contract> {
        return await this.contracts.findOne(filter);
    }

    async findOneById(contractId: string): Promise<Contract> {
        return await this.contracts.findOne({ _id: new ObjectId(contractId) });
    }

    async create(contract: IContractDetails): Promise<Contract> {
        return Promise.resolve(undefined);
    }

    async updateDeploymentDetails(contractId: string, contract: IContractDeployment): Promise<Contract> {
        return Promise.resolve(undefined);
    }
}
