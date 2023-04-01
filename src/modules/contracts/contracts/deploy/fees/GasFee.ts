import { FeeData, JsonRpcProvider, TransactionRequest } from '@ethersproject/providers';
import axios, { AxiosResponse } from 'axios';
import { BigNumber, utils } from 'ethers';
import { Blockchain } from '@/modules/contracts/contracts/model/contract.model';

export type Fees = {
    maxPriorityFeePerGas: BigNumber; // Max Priority Fee
    maxFeePerGas: BigNumber; // Max Fee Per Gas
};

/**
 * Ethereum EIP 1559 Gas Fee calculator
 *
 * Definitions:
 * 1. Base Fee, which is determined by the network itself. And is subsequently burned.
 * 2. Max Priority Fee, which is optional, determined by the user, and is paid directly to miners (maximum miner tip).
 * 3. Max Fee Per Gas (Max Fee), which is the absolute maximum you are willing to pay per unit of gas to get
 *    your transaction included in a block.
 * See: https://www.blocknative.com/blog/eip-1559-fees
 */
export class GasFee {
    constructor(
        private blockchain: Blockchain,
        private rpcProvider: JsonRpcProvider,
        private transactionRequest: TransactionRequest,
    ) {}

    /**
     * Estimate the deployment fees.
     */
    public async estimateGasFee(maxFees: Fees): Promise<BigNumber> {
        // "Base Fee" which is determined by the network itself.
        const estimateBaseFee = await this.rpcProvider.estimateGas(this.transactionRequest);

        // Estimated gas fees is [Base Gas] * [Max Fee Per Gas]
        return estimateBaseFee.mul(maxFees.maxFeePerGas).mul(200).div(100);
    }

    /**
     * Determine "Max Priority Fee" and "Max Fee Per Gas" fees.
     */
    public async determineMaxFees(): Promise<Fees> {
        const feeData = await this.rpcProvider.getFeeData();

        let fees = <Fees>{
            maxFeePerGas: feeData.maxFeePerGas.mul(150).div(100),
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.mul(150).div(100),
        };

        // https://github.com/ethers-io/ethers.js/issues/2828
        if (this.blockchain === 'POLYGON') {
            fees = await this.determinePolygonMaxFees(feeData, fees);
        }
        return fees;
    }

    private async determinePolygonMaxFees(feeData: FeeData, fees: Fees) {
        try {
            const fees = await axios({ method: 'GET', url: process.env.POLYGON_GAS_STATION_URL });
            return {
                maxFeePerGas: this.polyGonMaxFeePerGas(fees, feeData),
                maxPriorityFeePerGas: this.maxPriorityFeePerGas(fees, feeData),
            };
        } catch (error) {
            return fees;
        }
    }

    private polyGonMaxFeePerGas(fees: AxiosResponse<any>, feeData: FeeData) {
        return fees.data?.fast?.maxFee
            ? utils.parseUnits(Math.ceil(fees.data.fast.maxFee).toString(), 'gwei')
            : feeData.maxFeePerGas.mul(130).div(100);
    }

    private maxPriorityFeePerGas(fees: AxiosResponse<any>, feeData: FeeData) {
        return fees.data?.fast?.maxFee
            ? utils.parseUnits(Math.ceil(fees.data.fast.maxPriorityFee).toString(), 'gwei')
            : feeData.maxPriorityFeePerGas.mul(130).div(100);
    }
}
