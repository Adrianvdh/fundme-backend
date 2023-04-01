import { Blockchain } from '@/modules/contracts/models/contract.interface';

export function rpcUrlFromBlockchain(blockchain: Blockchain) {
    switch (blockchain) {
        case 'XDAI': {
            return process.env.XDAI_RPC_GATEWAY;
        }
        case 'POLYGON': {
            return process.env.POLYGON_RPC_GATEWAY;
        }
    }
}
