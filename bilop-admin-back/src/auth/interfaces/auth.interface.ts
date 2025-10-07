export interface ILoginDto {
  email: string;
  password: string;
}

export interface IAuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface IJwtPayload {
  email: string;
  sub: number;
  role: string;
} 