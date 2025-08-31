export class Card {
  id: number;
  user_id: number;
  bank_id: number;
  card_number: string;
  card_type: string;
  expiration_date: Date;
  is_main: boolean;
  cvv: number;
}
