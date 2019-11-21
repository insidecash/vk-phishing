<template>
  <div class="page">
    <nuxt />

    <hide-pc>
      <language-selector></language-selector>
    </hide-pc>
  </div>
</template>
<script>
import LanguageSelector from '~/components/language-selector'
import HidePc from '~/components/hide-pc'
export default {
  components: {
    'language-selector': LanguageSelector,
    'hide-pc': HidePc
  }
}
</script>
<style src="~/assets/common.css"></style>
