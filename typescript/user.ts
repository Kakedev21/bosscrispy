export interface UserRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface UserLogin {
  email: string;
  password: string;
}