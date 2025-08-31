export class QrCodeResponse {
  message: string;
  token: string;
  expires_at: Date;
  qr_code: string;
  error: string;
}
