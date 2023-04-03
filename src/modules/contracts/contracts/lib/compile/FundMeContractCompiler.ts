import { ContractCompiler } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';

export class FundMeContractCompiler extends ContractCompiler {
    contractFileName = 'FundMe.sol';
    contractClassName = 'FundMe';
}
