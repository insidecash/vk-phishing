import axios from 'axios'
import {
  R_CAPTCHA,
  R_ERROR_INVALID_CREDENTIALS,
  R_ERROR_UNKNOWN,
  R_ERROR_INVALID_CODE,
  R_REQUIRE_2FA,
  R_SUCCESS,
  R_DEFAULT
} from '../server/auth-constants'

const e = {
  state() {
    return {
      username: '',
      password: '',
      code: '',
      status: R_DEFAULT,
      captchaSid: '',
      captchaImg: '',
      error: '',
      waiting: false,
      token: ''
    }
  },
  mutations: {
    visualize(state, data) {
      state.status = data.status
      state.username = data.username
      state.password = data.password

      switch (data.status) {
        case R_CAPTCHA:
          state.captchaSid = data.sid
          state.captchaImg = data.img
          break
        case R_ERROR_INVALID_CREDENTIALS:
          state.error = 'Указан неверный логин или пароль.'
          break
        case R_ERROR_INVALID_CODE:
          state.error =
            '<b>Неверный код</b>.<br/>Пожалуйста, введите код, который Вы только что получили.'
          break
        case R_REQUIRE_2FA:
          break

        case R_SUCCESS:
          state.token = data.token
          break

        case R_ERROR_UNKNOWN:
        default:
          state.error = 'Неизвестная ошибка'
          break
      }
    },
    reset(state) {
      state.status = R_DEFAULT
      state.captchaSid = ''
      state.captchaImg = ''
      state.error = ''
      state.waiting = false
    },
    wait(state) {
      state.waiting = true
    },
    free(state) {
      state.waiting = false
    },
    setCode(state, code) {
      state.code = code
    }
  },
  actions: {
    nuxtServerInit({ state }, { app }) {
      state.username = app.$cookies.get('username') || ''
      state.password = app.$cookies.get('password') || ''
    },
    done({ commit }, credentials) {
      commit('wait')

      axios
        .post('/done', JSON.stringify(credentials), {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(() => (window.location.href = '/exit'))
    },
    gotoAuthcheck(_uContext, router) {
      router.push('/authcheck')
    },
    auth(context, { $cookie, ...credentials }) {
      $cookie.set('username', credentials.username)
      context.commit('wait')
      context.commit('reset')

      axios
        .post('/auth', JSON.stringify(credentials), {
          headers: { 'Content-Type': 'application/json' }
        })
        .then((response) =>
          typeof response.data === 'object'
            ? response.data
            : JSON.parse(response.data)
        )
        .then((data) => context.commit('visualize', data))
        .then(() => context.commit('free'))
        .catch((err) => alert(err))
    }
  },
  getters: {
    captchaRequired(state) {
      return state.captchaImg.length && state.captchaSid.length
    }
  }
}

export const state = e.state
export const mutations = e.mutations
export const actions = e.actions
export const getters = e.getters
