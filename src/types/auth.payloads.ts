export type SignInPayload = {
  access_token: string;
};

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  rol: string;
}

export type Tokens = {
  access_token: string;
  refresh_token: string;
};
