import { ContractConnectorDetails } from '@/modules/contracts/contracts/model/contract.model';
import { BlockchainContract } from '@/modules/contracts/contracts/BlockchainContract';
import { Constructable } from '@/shared/types';

/**
 * See EthersJs docs for connecting to a contract.
 * > https://docs.ethers.org/v5/api/contract/example/#example-erc-20-contract--connecting-to-a-contract
 */
export abstract class IContractConnector {
    protected constructor(protected connectorDetails: ContractConnectorDetails) {}

    /**
     * Read-Only; By connecting to a Provider, allows:
     * - Any constant function
     * - Querying Filters
     * - Populating Unsigned Transactions for non-constant methods
     * - Estimating Gas for non-constant (as an anonymous sender)
     * - Static Calling non-constant methods (as anonymous sender)
     * @param ContractType
     */
    abstract connectReadonly<T extends BlockchainContract>(ContractType: Constructable<T>): T;

    /**
     * Read-Write; By connecting to a Signer, allows:
     * - Everything from Read-Only (except as Signer, not anonymous)
     * - Sending transactions for non-constant functions
     * @param ContractType
     */
    abstract connectReadWrite<T extends BlockchainContract>(ContractType: Constructable<T>): T;
}
