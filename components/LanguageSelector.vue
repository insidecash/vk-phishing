<template>
  <div class="language-selector">
    <ul class="langs">
      <li>
        <a
          href="https://m.vk.com/settings?act=change_regional&lang_id=3"
          class="link"
          >English</a
        >
      </li>
      <li>
        <a
          href="https://m.vk.com/settings?act=change_regional&lang_id=1"
          class="link"
          >Українська</a
        >
      </li>
      <li>
        <a href="https://m.vk.com/settings?act=select_lang" class="link"
          >all languages &raquo;</a
        >
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'LanguageSelector'
}
</script>
<style>
.language-selector {
  display: block;
}
.langs {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0;
}

.langs li {
  list-style: none;
  padding: 4px 6px;
  color: #8a8a8a;
}

.langs a {
  color: inherit !important;
  font-size: 12px;
}
</style>
