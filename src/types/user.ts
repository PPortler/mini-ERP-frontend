export type UserInfoType = {
  user_id: string;
  username: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: string;
  create_at?: Date
  updated_at?: Date
  access_token?: string;
  access_token_exp?: number;
  refresh_token?: string;
  refresh_token_exp?: number;
};