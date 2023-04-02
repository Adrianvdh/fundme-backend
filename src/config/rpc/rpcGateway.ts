import { Blockchain } from '@/modules/contracts/contracts/model/contract.model';

export function rpcUrlFromBlockchain(blockchain: Blockchain) {
    switch (blockchain) {
        case 'XDAI': {
            return process.env.RPC_URL;
        }
        case 'POLYGON': {
            return process.env.RPC_URL;
        }
    }
}
