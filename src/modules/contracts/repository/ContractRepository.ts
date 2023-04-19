import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { MongoConnection } from '@/config/databases/mongodb';
import { MongoDict } from '@/config/databases/types';
import { DatabaseConnection } from '@/config/databases/connection';
import { IContractRepository } from '@/modules/contracts/repository/IContractRepository';
import { Contract, IContractDeployment, IContractDetails } from '@/modules/contracts/models/contract.interface';
import { MongoException } from '@/shared/exceptions/exceptions';
import {
    contractConnectorDetailsProjection,
    contractProjection
} from '@/modules/contracts/repository/ContractProjections';

export class ContractRepository implements IContractRepository {
    private readonly contracts: mongodb.Collection<Contract>;

    constructor(private databaseConnection: DatabaseConnection) {
        this.contracts = (this.databaseConnection as MongoConnection).db.collection<Contract>('contracts');
    }

    async findOneById(contractId: string): Promise<Contract> {
        const queryResult = await this.contracts.aggregate<Contract>([
            {
                $match: {
                    _id: new ObjectId(contractId),
                },
            },
            {
                $project: contractProjection,
            },
        ]);

        const result = await queryResult.toArray();
        return result.length === 1 ? result[0] : null;
    }

    async findOneContractConnectorDetailsById(contractId: string): Promise<Contract> {
        const queryResult = await this.contracts.aggregate<Contract>([
            {
                $match: {
                    _id: new ObjectId(contractId),
                },
            },
            {
                $project: contractConnectorDetailsProjection,
            },
        ]);

        const result = await queryResult.toArray();
        return result.length === 1 ? result[0] : null;
    }

    async create(contract: IContractDetails): Promise<Contract> {
        const contractDocument = {
            // Details
            ownerId: contract.ownerId,
            name: contract.name,
            description: contract.description,
            status: contract.status,
            onChainUrl: contract.onChainUrl,
            deployed: contract.deployed,
            // Deployment details
            blockchain: contract.blockchain,
            contractType: contract.contractType,
            keys: contract.keys,
            // Meta
            version: contract.version,
            createdOn: contract.createdOn,
            updatedOn: contract.updatedOn
        } as Contract;
        const result = await this.contracts.insertOne(contractDocument);
        if (!result.insertedId) {
            throw new MongoException('Failed to save the contract!');
        }
        return { _id: result.insertedId, ...contractDocument };
    }

    async updateDeploymentDetails(contractId: string, contract: IContractDeployment): Promise<Contract> {
        const update = {
            $set: {
                ...contract
            }
        };
        return await this.updateContract(contractId, update);
    }

    async markAsFailed(contractId: string, status: Pick<Contract, 'deployed' | 'status'>): Promise<Contract> {
        const update = {
            $set: {
                status: status.status,
                deployed: status.deployed
            }
        };

        return await this.updateContract(contractId, update);
    }

    private async updateContract(contractId: string, update: MongoDict): Promise<Contract> {
        const result = await this.contracts.updateOne({ _id: new ObjectId(contractId) }, update);
        if (result.modifiedCount === 0) {
            throw new MongoException('Failed to update the contract!');
        }
        return await this.findOneById(contractId);
    }
}
