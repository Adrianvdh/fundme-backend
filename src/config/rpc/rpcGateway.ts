import { ETHEREUM_RPC_URL, GNOSIS_RPC_URL } from '@config';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';

export function rpcUrlFromBlockchain(blockchain: Blockchain) {
    switch (blockchain) {
        case 'ETHEREUM': {
            return ETHEREUM_RPC_URL;
        }
        case 'GNOSIS': {
            return GNOSIS_RPC_URL;
        }
    }
}
