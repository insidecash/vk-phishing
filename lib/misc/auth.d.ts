import * as appCredentials from "./credentials";
import type { RequestInit } from "node-fetch";
import * as authConstants from "./auth-constants";
declare type userCredentials = {
    username: string;
    password: string;
    code?: string;
};
declare type typedAuthResponse<T extends keyof typeof authConstants, additionalData extends {} = {}> = {
    status: typeof authConstants[T];
} & userCredentials & additionalData;
declare type possibleAuthResponse = typedAuthResponse<"R_CAPTCHA", {
    sid: string;
    img: string;
}> | typedAuthResponse<"R_DEFAULT"> | typedAuthResponse<"R_ERROR_INVALID_CODE", {
    code: string;
}> | typedAuthResponse<"R_ERROR_INVALID_CREDENTIALS"> | typedAuthResponse<"R_ERROR_UNKNOWN"> | typedAuthResponse<"R_REQUIRE_2FA", {
    phone: string;
    type: string;
}> | typedAuthResponse<"R_SUCCESS", {
    token: string;
    access_token: string;
    user_id: number;
}> | typedAuthResponse<"R_ERROR_TO_MUCH_TRIES">;
/**
 *
 * @param {object} credentials
 * @param {string} app
 * @param {import('node-fetch').RequestInit} fetchOptions
 */
declare function auth(credentials: userCredentials & Record<string, unknown>, app?: keyof typeof appCredentials, fetchOptions?: RequestInit): Promise<possibleAuthResponse>;
export default auth;
export { auth };
