import { DeploymentOptions } from '@/modules/contracts/models/contract.interface';
import { CompilationDetails } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';

export interface IContractDeployer {
    deploy(options: DeploymentOptions, contractSource: CompilationDetails): void;
}
