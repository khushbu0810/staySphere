export interface Expense {
    id?: number;
    category: string;
    description: string;
    amount: number;
    expenseDate: string;    // ISO date string (yyyy-MM-dd)
    expenseMonth: string;
    paymentStatus: string;
}
