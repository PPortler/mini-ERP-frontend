export type UserInfoType = {
  id?: string; //from backend use id but frontend use user_id
  user_id: string;
  username: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: string;
  created_at?: string
  updated_at?: string
  access_token?: string;
  access_token_exp?: number;
  refresh_token?: string;
  refresh_token_exp?: number;
};