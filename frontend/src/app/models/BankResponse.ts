export interface Bank {
  id: number;
  name: string;
}

export class BankResponse {
  message!: string;
  data!: Bank[];
  error: string;
}
