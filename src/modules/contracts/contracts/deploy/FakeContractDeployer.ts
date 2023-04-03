import { IContractDeployer } from '@/modules/contracts/contracts/deploy/IContractDeployer';
import { CompilationDetails } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';
import { DeploymentOptions } from '@/modules/contracts/contracts/model/contract.model';
import { BlockchainContract } from '@/modules/contracts/contracts/BlockchainContract';
import { Constructable } from '@/shared/types';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider, TransactionResponse } from '@ethersproject/abstract-provider';

export class FakeContractDeployer implements IContractDeployer {
    async deploy<T extends BlockchainContract>(
        ContractType: Constructable<T>,
        options: DeploymentOptions,
        contractSource: CompilationDetails,
    ): Promise<T> {
        // Wait
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Return fake contract
        const contract = new (class extends BlockchainContract {
            address(): string {
                return 'some address';
            }

            signer(): Signer {
                return null;
            }

            provider(): Provider {
                return null;
            }

            deployTransaction(): TransactionResponse {
                return null;
            }
        })(null);
        return new ContractType(contract);
    }
}
