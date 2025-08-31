import { User } from './User';

export class LoginResponse {
  id: number;
  message: string;
  user: User;
  token: string;
  error: string;
}
