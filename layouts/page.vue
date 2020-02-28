<template>
  <div class="page">
    <nuxt />

    <hide-pc>
      <language-selector></language-selector>
    </hide-pc>
  </div>
</template>
<script>
import LanguageSelector from '~/components/LanguageSelector'
import HidePC from '~/components/HidePC'
export default {
  components: {
    'language-selector': LanguageSelector,
    'hide-pc': HidePC
  }
}
</script>
<style src="~/assets/common.css"></style>
