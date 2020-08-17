import * as appCredentials from "./credentials";
import fetch from "node-fetch";
import { stringify } from "querystring";

import {
  R_CAPTCHA,
  R_ERROR_INVALID_CODE,
  R_ERROR_INVALID_CREDENTIALS,
  R_ERROR_UNKNOWN,
  R_REQUIRE_2FA,
  R_SUCCESS
} from "./auth-constants";

/**
 *
 * @param {object} credentials
 * @param {string} app
 * @param {import('node-fetch').RequestInit} fetchOptions
 */
async function auth(credentials, app = "android", fetchOptions = {}) {
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
    json = await fetch(
      apiUrl +
        "?" +
        stringify({
          ...appParameters,
          ...credentials
        }),
      ...fetchOptions
    ).then(response => response.json());
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
          status: R_CAPTCHA,
          ...credentials,
          sid: json.captcha_sid,
          img: json.captcha_img
        };
      case "need_validation":
        if (json.validation_type && json.validation_type.startsWith("2fa")) {
          return {
            status: R_REQUIRE_2FA,
            type: json.validation_type,
            phone: json.phone_mask,
            ...credentials
          };
        } else {
          return { status: R_ERROR_UNKNOWN, ...credentials };
        }
      case "invalid_client":
        return {
          status:
            json.error_type === "username_or_password_is_incorrect"
              ? R_ERROR_INVALID_CREDENTIALS
              : R_ERROR_UNKNOWN,
          ...credentials
        };

      case "invalid_request":
        return {
          status:
            json.error_type === "otp_format_is_incorrect"
              ? R_ERROR_INVALID_CODE
              : R_ERROR_UNKNOWN,
          ...credentials
        };

      default:
        return { status: R_ERROR_UNKNOWN, ...credentials };
    }
  } else {
    return {
      status: R_SUCCESS,
      ...credentials,
      ...json,
      token: json.access_token,
      user_id: json.user_id
    };
  }
}

export default auth;
export { auth };
