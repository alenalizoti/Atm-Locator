import { Card } from './Card';

export class ProfileDataResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  gender: string;
  main_card_number: null;
  createdAt: Date;
  updatedAt: Date;
  Cards: Card[];
  Withdrawals: [];
  favorite_atms: [];
  error: string;
}
