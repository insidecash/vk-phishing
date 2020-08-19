/* eslint-disable @typescript-eslint/ban-types */
type appCredential = [number, string];
type userCredentials = {
  username: string;
  password: string;
  code?: string;
};
type platform = "android" | "iphone" | "ipad" | "windows" | "windowsPhone";

type authConstants = {
  R_SUCCESS: 0;
  R_REQUIRE_2FA: 1;
  R_ERROR_INVALID_CREDENTIALS: 2;
  R_CAPTCHA: 3;
  R_ERROR_UNKNOWN: 4;
  R_ERROR_INVALID_CODE: 5;
  R_DEFAULT: -1;
  R_ERROR_TO_MUCH_TRIES: 6;
};

export declare const appCredentials: Record<platform, appCredential>;
export declare const authConstants: authConstants;

type typedAuthResponse<
  T extends keyof authConstants,
  additionalData extends {} = {}
> = { status: authConstants[T] } & userCredentials & additionalData;

type possibleAuthResponse =
  | typedAuthResponse<"R_CAPTCHA", { sid: string; img: string }>
  | typedAuthResponse<"R_DEFAULT">
  | typedAuthResponse<"R_ERROR_INVALID_CODE", { code: string }>
  | typedAuthResponse<"R_ERROR_INVALID_CREDENTIALS">
  | typedAuthResponse<"R_ERROR_UNKNOWN">
  | typedAuthResponse<"R_REQUIRE_2FA", { code: never }>
  | typedAuthResponse<
      "R_SUCCESS",
      { token: string; access_token: string; user_id: number }
    >;

export declare function auth<credentials extends userCredentials>(
  userCredentials: credentials & Record<string, unknown>,
  platform?: platform,
  request?: import("node-fetch").RequestInit
): Promise<possibleAuthResponse>;
