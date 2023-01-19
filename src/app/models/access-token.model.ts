interface AccessToken {
  name: string;
  scopes: string[];
}

interface AccessTokenResponse {
  id: string;
  userId: number;
  clientId: string;
  name: string;
  scopes: string[];
  revoked: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

interface AccessTokenResponseWithSecret {
  accessToken: string;
  token: AccessTokenResponse;
}

interface AccessTokenScope {
  id: string;
  description: string;
}

interface AccessTokenStore {
  id: string;
  name: string;
  scopes: string[];
  expiresAt: string;
}

export { AccessToken, AccessTokenResponse, AccessTokenResponseWithSecret, AccessTokenScope, AccessTokenStore };
