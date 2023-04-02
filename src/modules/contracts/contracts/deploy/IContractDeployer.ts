import { CompilationDetails } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';
import { DeploymentOptions } from '@/modules/contracts/contracts/model/contract.model';
import { Contract } from '@/modules/contracts/contracts/Contract';
import { Constructable } from '@/shared/types';
import { IContractConnectorDetails } from '@/modules/contracts/models/contract.interface';

export abstract class IContractDeployer {
    protected constructor(protected options: DeploymentOptions, protected contractSource: CompilationDetails) {}

    abstract deploy<T extends Contract>(ContractType: Constructable<T>, IContractConnectorDetails): Promise<T>;
}
