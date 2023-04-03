import { RPC_URL } from '@config';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';

export function rpcUrlFromBlockchain(blockchain: Blockchain) {
    switch (blockchain) {
        case 'XDAI': {
            return RPC_URL;
        }
        case 'POLYGON': {
            return RPC_URL;
        }
    }
}
