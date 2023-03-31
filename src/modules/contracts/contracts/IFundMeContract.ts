export interface IFundMeContract {
    fund(amount: string);

    withdraw(amount: string);

    getFunder(index: number): string;

    pause(): void;

    unpause(): void;
}
