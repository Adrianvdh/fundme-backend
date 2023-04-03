import { Blockchain } from '@/modules/contracts/contracts/model/contract.model';
import { RPC_URL } from '@config';

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
