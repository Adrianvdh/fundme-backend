import { Blockchain } from '@/modules/contracts/models/contract.interface';

export function rpcUrlFromBlockchain(blockchain: Blockchain) {
    switch (blockchain) {
        case Blockchain.XDAI: {
            return process.env.XDAI_RPC_GATEWAY;
        }
        case Blockchain.POLYGON: {
            return process.env.POLYGON_RPC_GATEWAY;
        }
    }
}
