import { RPC_URL } from '@config';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';

export function rpcUrlFromBlockchain(blockchain: Blockchain) {
    switch (blockchain) {
        case 'ETHEREUM': {
            return RPC_URL;
        }
        case 'GNOSIS': {
            return RPC_URL;
        }
    }
}
