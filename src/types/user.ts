export interface User {
  id: string;
  name: string;
  icon: string;
  email: string;
  emailVerified: boolean;
}

export interface NewUser {
  email: string;
  password: string;
  name: string;
  icon: string;
}
