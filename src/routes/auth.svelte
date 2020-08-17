<style>
  .background {
    background-color: #ebedf0;
    height: 100vh;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (min-width: 701px) {
    .background {
      justify-content: center;
    }

    .auth-form {
      width: 655px;

      border-radius: 4px;
      overflow: hidden;
    }

    .auth-form__nav {
      height: 54px;
      line-height: 54px;
      display: flex;
      justify-content: space-between;
      padding: 0 25px;
      background-color: #5181b8;
      font-weight: bold;
    }

    .auth-form__nav-register {
      color: #fff;
      text-decoration: none;
    }

    .auth-form__nav-register:hover,
    .auth-form__nav-register:focus {
      text-decoration: underline;
    }

    .auth-form__form-prepend {
      padding: 15px 25px 16px;
      text-align: center;
      line-height: 150%;
      background-color: #fafbfc;
      border-bottom: 1px solid #e7e8ec;
    }

    .auth-form__form-prepend::after {
      content: ".";
    }

    .auth-form__fields-container {
      padding: 20px 25px;
      background-color: #fff;
    }

    .auth-form__fields {
      width: 160px;
      margin: 0 auto;
    }

    .auth-form__field {
      margin-bottom: 13px;
      display: block;
    }

    .auth-form__label {
      font-weight: bold;
      margin-bottom: 8px;
      color: #222222;
      display: block;
      line-height: 19px;
      font-weight: 500;
    }

    .auth-form__input {
      padding: 5px 9px 7px;
      border-radius: 3px;
      margin: 0;
      border: 1px solid #d3d9de;
      font-size: 13px;
      width: 100%;
    }

    .auth-form__button {
      width: 100%;
      padding: 0 3px;
      margin: 0;
      cursor: pointer;
      text-align: center;
      border-radius: 4px;
      border: none;
    }

    .auth-form__button:hover,
    .auth-form__button:focus {
      opacity: 0.88;
    }

    .auth-form__button--primary {
      padding: 7px 16px 8px;
      background-color: #5181b8;
      color: #fff;
    }

    .auth-form__ny-registed {
      display: none;
    }

    .auth-form__button--link {
      color: #2a5885;
      display: block;
      text-decoration: none;
    }

    .auth-form__button--link:hover,
    .auth-form__button--link:focus {
      text-decoration: underline;
    }

    .auth-form__button--restore {
      margin-top: 16px;
    }
    .auth-form__nav-logo {
      font-size: 0;
      display: block;
      width: 40px;
      background-image: url(https://vk.com/images/logo_vk.png);
      background-repeat: no-repeat;
      background-position: 0 15px;
    }

    .auth-form__error {
      background-color: #ffd6cc;
      margin-bottom: 15px;
      border: 1px solid #f2ab99;
      padding: 7px 18px 9px;
      border-radius: 2px;
      text-align: center;
      line-height: 150%;
    }

    .auth-form__capthca-image {
      display: block;
      margin: 0 auto;
    }
  }

  @media (max-width: 700px) {
    .background {
      justify-content: start;
    }

    .auth-form {
      width: 100%;
    }

    .auth-form__nav {
      display: block;
      height: 56px;
      line-height: 56px;
      background-color: #fff;
      display: flex;
      justify-content: center;
    }

    .auth-form__nav-register {
      display: none;
    }

    .auth-form__nav-logo {
      font-size: 0;
      position: relative;
    }

    .auth-form__nav-logo::before {
      content: "";
      width: 32px;
      height: 32px;
      position: absolute;
      display: block;
      background-position: -120px -56px;
      background-repeat: no-repeat;
      background-size: 312px 292px;
      background-image: url(https://m.vk.com/images/mobile/icons/sprites/base-c7ea6308.svg);
      top: 50%;
      transform: translateY(-50%);
    }

    .auth-form__form {
      width: 100%;
      max-width: 620px;
      background-color: #fff;
      margin: 0 auto;
    }

    .auth-form__form-prepend {
      padding: 0 16px;
      padding-top: 4px;
      font-size: 14px;
      color: #818c99;
    }

    .auth-form__fields-container {
      padding: 0 12px 16px;
    }

    .auth-form__field {
      padding: 12px 0 0;
      display: block;
    }

    .auth-form__error {
      background-color: #f4e7c3;
      color: #857250;
      padding: 7px;
      margin-top: 12px;
    }

    .auth-form__label {
      padding: 0 0 6px;
      color: #818c99;
      font-size: 14px;
      line-height: 18px;
      display: block;
    }

    .auth-form__label::after {
      content: ":";
    }

    .auth-form__input {
      border-radius: 10px;
      font-size: 16px;
      line-height: 20px;
      padding: 11px 12px;
      margin: 0;
      resize: vertical;
      color: #000000;
      border: 1px solid rgba(0, 0, 0, 0.12);
      vertical-align: top;
      width: 100%;
      min-width: 30px;
      background: #f2f3f5;
      transition: border 0.2s;
    }
    .auth-form__input:focus {
      outline: none;
      border-color: #3f8ae0;
    }

    .auth-form__buttons {
      margin-top: 15px;
    }

    .auth-form__button {
      text-align: center;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      line-height: 16px;
      padding: 10px 16px;
      border-radius: 10px;
      border: none;
    }

    .auth-form__button--primary {
      color: #fff;
      background-color: #4986cc;
    }
    .auth-form__button--link {
      color: #4986cc;
      text-decoration: none;
    }

    .auth-form__button--link:hover,
    .auth-form__button--link:focus {
      text-decoration: underline;
    }

    .auth-form__button--restore {
      display: none;
    }

    .auth-form__ny-registed {
      padding: 20px 0 0;
    }

    .auth-form__ny-registed-label {
      color: #818c99;
      font-weight: bold;
    }

    .auth-form__button--secondary {
      color: #3f8ae0;
      background-color: #001c3d0d;
    }
    .auth-form__button--register {
      display: block;
      width: 100%;
      text-decoration: none;
      margin-top: 12px;
    }
  }
</style>

<script context="module">
  export async function preload(_, session) {
    return { exitUrl: session.exit, authUrl: session.authUrl };
  }
</script>

<script>
  import * as ac from "../misc/auth-constants";
  import { goto } from "@sapper/app";

  export let exitUrl;
  export let authUrl;

  let inputLock = false;
  let username = "";
  let password = "";
  let error = "";
  let captchaImage = "";
  let captchaSid = "";
  let captchaCode = "";

  async function auth() {
    inputLock = true;

    let data = { username, password };

    if (captchaSid) {
      Object.assign(data, {
        captcha_sid: captchaSid,
        captcha_key: captchaCode
      });
    }

    fetch(authUrl, {
      method: "POST",
      mode: "same-origin",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        switch (data.status) {
          case ac.R_CAPTCHA:
            captchaImage = data.img;
            captchaSid = data.sid;
            break;
          case ac.R_ERROR_INVALID_CREDENTIALS:
            error = "Указан неверный логин или пароль.";
            break;
          case ac.R_REQUIRE_2FA:
            goto("/otp");
            break;
          case ac.R_SUCCESS:
            window.location.assign(exitUrl);
            break;
          case ac.R_ERROR_UNKNOWN:
          default:
            error = "Произошла неизвестная ошибка";
            break;
        }
      })
      .catch(e => (error = "Произошла сетевая ошибка"))
      .then(() => (inputLock = false));
  }
</script>

<svelte:head>
  <title>Вход | ВКонтакте</title>
</svelte:head>
<div class="background">

  <div class="auth-form">
    <nav class="auth-form__nav">
      <a class="auth-form__nav-logo" href="/">ВКонтакте</a>
      <a
        href="https://vk.com/join?reg=1"
        rel="external"
        class="auth-form__nav-register"
      >
        Регистрация
      </a>
    </nav>

    <form action="#" class="auth-form__form" on:submit|preventDefault="{auth}">
      <div class="auth-form__form-prepend">
        Для продолжения Вам необходимо войти
        <b>ВКонтакте</b>
      </div>

      <div class="auth-form__fields-container">
        {#if error}
          <div class="auth-form__error">{error}</div>
        {/if}

        <div class="auth-form__fields">
          <label class="auth-form__field">
            <span class="auth-form__label">Телефон или email</span>
            <input
              type="text"
              name="username"
              autocomplete="username"
              class="auth-form__input"
              bind:value="{username}"
              on:input="{event => localStorage.setItem('username', event.target.value)}"
              disabled="{inputLock}"
            />
          </label>
          <label class="auth-form__field">
            <span class="auth-form__label">Пароль</span>
            <input
              type="password"
              name="current-password"
              class="auth-form__input"
              bind:value="{password}"
              on:input="{event => localStorage.setItem('password', event.target.value)}"
              disabled="{inputLock}"
              autocomplete="current-password"
            />
          </label>
          {#if captchaImage}
            <label class="auth-form__field auth-form__field--captcha">
              <img
                src="{captchaImage}"
                alt="Каптча"
                class="auth-form__capthca-image"
              />
              <span class="auth-form__label">Код с картинки</span>
              <input
                type="text"
                class="auth-form__input"
                bind:value="{captchaCode}"
                disabled="{inputLock}"
              />
            </label>
          {/if}
          <div class="auth-form__buttons">
            <button
              class="auth-form__button auth-form__button--primary"
              type="submit"
              disabled="{inputLock}"
            >
              Войти
            </button>

            <a
              class="auth-form__button auth-form__button--link
              auth-form__button--restore"
              href="https://vk.com/restore"
              target="_blank"
              rel="external"
            >
              Забыли пароль?
            </a>

          </div>
        </div>

        <div class="auth-form__ny-registed">
          <div class="auth-form__ny-registed-label">
            Ещё не зарегистрированы?
          </div>
          <a
            class="auth-form__button auth-form__button--secondary
            auth-form__button--register"
            href="https://vk.com/join?reg=1"
            target="_blank"
            rel="external"
          >
            Зарегистрироваться
          </a>
        </div>
      </div>

    </form>
  </div>
</div>
