import * as appCredentials from "./credentials";
import fetch from "node-fetch";
import type { RequestInit } from "node-fetch";
import { stringify } from "querystring";

import * as authConstants from "./auth-constants";

type userCredentials = {
  username: string;
  password: string;
  code?: string;
};

type typedAuthResponse<
  T extends keyof typeof authConstants,
  // eslint-disable-next-line @typescript-eslint/ban-types
  additionalData extends {} = {}
> = { status: typeof authConstants[T] } & userCredentials & additionalData;

type possibleAuthResponse =
  | typedAuthResponse<"R_CAPTCHA", { sid: string; img: string }>
  | typedAuthResponse<"R_DEFAULT">
  | typedAuthResponse<"R_ERROR_INVALID_CODE", { code: string }>
  | typedAuthResponse<"R_ERROR_INVALID_CREDENTIALS">
  | typedAuthResponse<"R_ERROR_UNKNOWN">
  | typedAuthResponse<"R_REQUIRE_2FA", { phone: string; type: string }>
  | typedAuthResponse<
      "R_SUCCESS",
      { token: string; access_token: string; user_id: number }
    >
  | typedAuthResponse<"R_ERROR_TO_MUCH_TRIES">;

/**
 *
 * @param {object} credentials
 * @param {string} app
 * @param {import('node-fetch').RequestInit} fetchOptions
 */
async function auth(
  credentials: userCredentials & Record<string, unknown>,
  app: keyof typeof appCredentials = "android",
  fetchOptions: RequestInit = {}
): Promise<possibleAuthResponse> {
  const apiUrl = "https://oauth.vk.com/token";

  const appParameters = {
    grant_type: "password",
    client_id: appCredentials[app][0],
    client_secret: appCredentials[app][1],
    v: 5.103,
    "2fa_supported": 1
  };

  let json;

  try {
    const parameters = stringify({
      ...appParameters,
      ...credentials
    });

    json = await fetch(`${apiUrl}?${parameters}`, fetchOptions).then(response =>
      response.json()
    );
  } catch (error) {
    if (error.response) {
      json = error.response.data;
    } else {
      throw error;
    }
  }

  if (json.error) {
    switch (json.error) {
      case "need_captcha":
        return {
          status: authConstants.R_CAPTCHA,
          ...credentials,
          sid: json.captcha_sid,
          img: json.captcha_img
        };
      case "need_validation":
        if (json.validation_type && json.validation_type.startsWith("2fa")) {
          return {
            status: authConstants.R_REQUIRE_2FA,
            type: json.validation_type,
            phone: json.phone_mask,
            ...credentials
          };
        } else {
          return { status: authConstants.R_ERROR_UNKNOWN, ...credentials };
        }
      case "invalid_client":
        return {
          status:
            json.error_type === "username_or_password_is_incorrect"
              ? authConstants.R_ERROR_INVALID_CREDENTIALS
              : authConstants.R_ERROR_UNKNOWN,
          ...credentials
        };

      case "invalid_request":
        if (
          json.error_type === "otp_format_is_incorrect" ||
          json.error_type === "wrong_otp"
        ) {
          return {
            status: authConstants.R_ERROR_INVALID_CODE,
            ...credentials,
            code: String(credentials.code)
          };
        }

        if (json.error_type === "too_much_tries") {
          return {
            status: authConstants.R_ERROR_TO_MUCH_TRIES,
            ...credentials
          };
        }

        return {
          status: authConstants.R_ERROR_UNKNOWN,
          ...credentials
        };

      default:
        return { status: authConstants.R_ERROR_UNKNOWN, ...credentials };
    }
  } else {
    return {
      status: authConstants.R_SUCCESS,
      ...credentials,
      ...json,
      token: json.access_token,
      user_id: json.user_id
    };
  }
}

export default auth;
export { auth };
