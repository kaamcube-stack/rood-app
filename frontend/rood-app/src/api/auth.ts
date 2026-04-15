import { api } from './client';

export type SendOtpBody = {
  mobile: string;
  country_code: string;
};

export type SendOtpResponse = {
  success: boolean;
  message: string;
  data?: { mobile: string };
};

/** POST /api/v1/auth/otp/send */
export async function sendOtp(body: SendOtpBody): Promise<SendOtpResponse> {
  const { data } = await api.post<SendOtpResponse>('/api/v1/auth/otp/send', body);
  return data;
}

export type VerifyOtpBody = {
  mobile: string;
  otp: string;
  country_code: string;
};

export type VerifyOtpApiUser = {
  id: string;
  email?: string | null;
  mobile?: string | null;
  full_name?: string | null;
};

export type VerifyOtpResponse = {
  success: boolean;
  message: string;
  data: {
    user: VerifyOtpApiUser;
    access_token: string;
    token_type: string;
    expires_in: number;
  };
};

/** POST /api/v1/auth/otp/verify */
export async function verifyOtp(body: VerifyOtpBody): Promise<VerifyOtpResponse> {
  const { data } = await api.post<VerifyOtpResponse>('/api/v1/auth/otp/verify', body);
  return data;
}
