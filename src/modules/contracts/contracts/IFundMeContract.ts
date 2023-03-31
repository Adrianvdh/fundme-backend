export interface FundMeContract {
    fund(amount: string, fromAddress: string);

    withdraw(amount: string, toAddress: string);

    getFunder(index: number): string;

    pause(): void;

    unpause(): void;
}
