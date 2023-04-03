import path from 'path';
import * as solc from 'solc';
import fs from 'fs';

export interface CompilationDetails {
    byteCode: string;
    abi: string;
}
export class CompilerException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export abstract class ContractCompiler {
    abstract contractFileName: string;
    abstract contractClassName: string;

    /**
     * See: https://github.com/ethereum/solc-js#example-usage-without-the-import-callback
     */
    public compile(): CompilationDetails {
        const contractPath = path.resolve(__dirname, '../contracts', this.contractFileName);
        const source = fs.readFileSync(contractPath, 'utf-8');

        const contractCompilationData = {
            language: 'Solidity',
            sources: {
                [this.contractFileName]: {
                    content: source,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };
        const compiledContract = JSON.parse(solc.compile(JSON.stringify(contractCompilationData)));
        if (compiledContract.errors) {
            throw new CompilerException(compiledContract.errors[0].message);
        }
        const contractClass = compiledContract.contracts[this.contractFileName][this.contractClassName];
        return {
            byteCode: contractClass.evm.bytecode.object,
            abi: JSON.stringify(contractClass.abi),
        };
    }
}
