import { CompilationDetails } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';
import { DeploymentOptions } from '@/modules/contracts/contracts/model/contract.model';

export interface IContractDeployer {
    deploy(options: DeploymentOptions, contractSource: CompilationDetails): void;
}
