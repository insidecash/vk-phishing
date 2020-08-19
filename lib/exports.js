'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fetch = require('node-fetch');
var querystring = require('querystring');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

const android = [2274003, "hHbZxrka2uZ6jB1inYsH"];
const iphone = [3140623, "VeWdmVclDCtn6ihuP1nt"];
const ipad = [3682744, "mY6CDUswIVdJLCD3j15n"];
const windows = [3697615, "AlVXZFMUqyrnABp8ncuU"];
const windowsPhone = [3502557, "PEObAuQi6KloPM4T30DV"];

var appCredentials = /*#__PURE__*/Object.freeze({
  __proto__: null,
  android: android,
  iphone: iphone,
  ipad: ipad,
  windows: windows,
  windowsPhone: windowsPhone
});

const R_SUCCESS = 0;
const R_REQUIRE_2FA = 1;
const R_ERROR_INVALID_CREDENTIALS = 2;
const R_CAPTCHA = 3;
const R_ERROR_UNKNOWN = 4;
const R_ERROR_INVALID_CODE = 5;
const R_DEFAULT = -1;
const R_ERROR_TO_MUCH_TRIES = 6;

var authConstants = /*#__PURE__*/Object.freeze({
  __proto__: null,
  R_SUCCESS: R_SUCCESS,
  R_REQUIRE_2FA: R_REQUIRE_2FA,
  R_ERROR_INVALID_CREDENTIALS: R_ERROR_INVALID_CREDENTIALS,
  R_CAPTCHA: R_CAPTCHA,
  R_ERROR_UNKNOWN: R_ERROR_UNKNOWN,
  R_ERROR_INVALID_CODE: R_ERROR_INVALID_CODE,
  R_DEFAULT: R_DEFAULT,
  R_ERROR_TO_MUCH_TRIES: R_ERROR_TO_MUCH_TRIES
});

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
        const parameters = querystring.stringify(Object.assign(Object.assign({}, appParameters), credentials));
        json = await fetch__default['default'](`${apiUrl}?${parameters}`, fetchOptions).then(response => response.json());
    }
    catch (error) {
        if (error.response) {
            json = error.response.data;
        }
        else {
            throw error;
        }
    }
    if (json.error) {
        switch (json.error) {
            case "need_captcha":
                return Object.assign(Object.assign({ status: R_CAPTCHA }, credentials), { sid: json.captcha_sid, img: json.captcha_img });
            case "need_validation":
                if (json.validation_type && json.validation_type.startsWith("2fa")) {
                    return Object.assign({ status: R_REQUIRE_2FA, type: json.validation_type, phone: json.phone_mask }, credentials);
                }
                else {
                    return Object.assign({ status: R_ERROR_UNKNOWN }, credentials);
                }
            case "invalid_client":
                return Object.assign({ status: json.error_type === "username_or_password_is_incorrect"
                        ? R_ERROR_INVALID_CREDENTIALS
                        : R_ERROR_UNKNOWN }, credentials);
            case "invalid_request":
                if (json.error_type === "otp_format_is_incorrect" ||
                    json.error_type === "wrong_otp") {
                    return Object.assign(Object.assign({ status: R_ERROR_INVALID_CODE }, credentials), { code: String(credentials.code) });
                }
                if (json.error_type === "too_much_tries") {
                    return Object.assign({ status: R_ERROR_TO_MUCH_TRIES }, credentials);
                }
                return Object.assign({ status: R_ERROR_UNKNOWN }, credentials);
            default:
                return Object.assign({ status: R_ERROR_UNKNOWN }, credentials);
        }
    }
    else {
        return Object.assign(Object.assign(Object.assign({ status: R_SUCCESS }, credentials), json), { token: json.access_token, user_id: json.user_id });
    }
}

exports.appsCredentials = appCredentials;
exports.auth = auth;
exports.authConstants = authConstants;
