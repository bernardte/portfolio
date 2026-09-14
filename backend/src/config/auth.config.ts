import { registerAs } from "@nestjs/config";

export default registerAs('authconfig', () => ({
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
}));