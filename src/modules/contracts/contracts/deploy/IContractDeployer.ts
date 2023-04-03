import { CompilationDetails } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';
import { DeploymentOptions } from '@/modules/contracts/contracts/model/contract.model';
import { BlockchainContract } from '@/modules/contracts/contracts/BlockchainContract';
import { Constructable } from '@/shared/types';

export interface IContractDeployer {
    deploy<T extends BlockchainContract>(
        ContractType: Constructable<T>,
        options: DeploymentOptions,
        contractSource: CompilationDetails,
    ): Promise<T>;
}
