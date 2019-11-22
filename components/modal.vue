<template>
  <div v-show="shown" class="modal">
    <div class="modal-container">
      <header class="modal-header">
        <span class="modal-name">{{ header }}</span>
        <span class="modal-close" @click="close()">&times;</span>
      </header>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
    <div class="modal-shadow" @click="close()"></div>
  </div>
</template>
<script>
export default {
  props: {
    header: {
      type: String,
      default: 'Unnamed'
    },
    shown: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
.modal-shadow {
  position: fixed;
  background: #000;
  opacity: 0.7;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100vh;
}
.modal-container {
  position: absolute;
  top: 20vh;
  left: 50%;
  width: 100%;
  max-width: 450px;
  z-index: 1005;
}
.modal-header {
  display: flex;
  width: 100%;
  height: 54px;
  font-size: 14px;
  padding: 0 25px;
  line-height: 54px;
  background-color: #5b88bd;
  color: #fff;
  border-radius: 4px 4px 0 0;
}
.modal-content {
  width: 100%;
  padding: 20px 25px;
  background-color: #fff;
  line-height: 19px;
  border-radius: 0 0 4px 4px;
  font-size: 13px;
}
</style>
