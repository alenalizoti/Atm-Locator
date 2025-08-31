import { Atm } from './Atm';

export class TransactionPanelInfo {
  id: number = 0;
  user_id: number;
  card_id: number = 0;
  atm_id: number = 0;
  amount: number = 0;
  method: string = '';
  token: string = '';
  expires_at: Date = null;
  is_used: boolean = false;
}
