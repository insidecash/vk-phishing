module.exports = {
  server: {
    host: '127.0.0.1',
    port: 3000
  },

  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'ВКонтакте | Вход',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#4680c2' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    // 'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'cookie-universal-nuxt'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  pwa: {
    manifest: {
      name: 'ВКонтакте',
      short_name: 'ВКонтакте',
      description:
        'ВКонтакте — это социальная сеть для быстрой и удобной коммуникации между людьми по всему миру. Вы можете обмениваться сообщениями и делиться фотографиями, следить за новостями Ваших друзей и заводить новые знакомства, смотреть видеозаписи, слушать музыку и вступать в сообщества.',
      scope: '/',
      theme_color: '#4680c2',
      background_color: '#4680c2',
      lang: 'ru',
      start_url: '/login',
      display: 'standalone'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
