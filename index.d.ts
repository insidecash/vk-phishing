type appCredential = [number, string];
type userCredentials = { username: string; password: string };
type platform = "android" | "iphone" | "ipad" | "windows" | "windowsPhone";

declare const appCredentials: Record<platform, appCredential>;

declare const authConstants: {
  R_SUCCESS: 0;
  R_REQUIRE_2FA: 1;
  R_ERROR_INVALID_CREDENTIALS: 2;
  R_CAPTCHA: 3;
  R_ERROR_UNKNOWN: 4;
  R_ERROR_INVALID_CODE: 5;
  R_DEFAULT: -1;
};

declare function auth<credentials extends userCredentials>(
  userCredentials: credentials,
  platform: platform,
  request: import("node-fetch").RequestInit
): userCredentials & Record<string, unknown>;
