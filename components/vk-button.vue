<template>
  <div v-if="type === 'submit'">
    <label
      :class="[
        'vk-button',
        `vk-button-${variant}`,
        `vk-button-${disabled ? 'disabled' : 'enabled'}`
      ]"
      :style="btnStyle"
      @click="clickToParent($event)"
    >
      <slot></slot>
      <input type="submit" style="display: none" :disabled="disabled" />
    </label>
  </div>
  <div v-else-if="type === 'link'">
    <a
      :href="href"
      :class="[
        'vk-button',
        `vk-button-${variant}`,
        `vk-button-${disabled ? 'disabled' : 'enabled'}`
      ]"
      :target="blank ? '_blank' : '_self'"
      :style="btnStyle"
    >
      <slot></slot>
    </a>
  </div>
  <div v-else>
    <button
      :class="[
        'vk-button',
        `vk-button-${variant}`,
        `vk-button-${disabled ? 'disabled' : 'enabled'}`
      ]"
      :style="btnStyle"
      :disabled="disabled"
      @click="clickToParent($event)"
    >
      <slot></slot>
    </button>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    type: {
      type: String,
      default: 'button'
    },
    variant: {
      type: String,
      default: 'link'
    },
    href: {
      type: String,
      default: '#'
    },
    blank: {
      type: Boolean,
      default: false
    },
    btnStyle: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
class VkButton extends Vue {
  clickToParent(e) {
    this.$emit('click', e)
  }
}

export default VkButton
</script>
<style>
.vk-button-primary {
  color: #fff !important;
  background-color: var(--primary-lighter-color) !important;
}

.vk-button-secondary {
  color: var(--primary-button-text-color) !important;
  background-color: var(--bg-color) !important;
}

.vk-button-link {
  text-decoration: none;
  color: var(--current-text-accent);
  background: transparent;
  cursor: pointer;
  font-size: var(--font-size-md);
}

.vk-button-link:hover {
  text-decoration: underline;
}

@keyframes loadingBefore {
  0% {
    box-shadow: -6px 0 0 rgb(224, 232, 241, 0.2);
  }

  24% {
    background-color: rgb(224, 232, 241, 0.2);
  }

  34% {
    box-shadow: -6px 0 0 rgb(224, 232, 241, 1);
  }

  58% {
    background-color: rgb(224, 232, 241, 1);
  }

  100% {
    box-shadow: -6px 0 0 rgb(224, 232, 241, 0.2);
  }
}

@keyframes loadingAfter {
  48% {
    background-color: rgb(224, 232, 241, 0.2);
  }
  82% {
    background-color: rgb(224, 232, 241, 1);
  }
}

@media screen and (min-width: 751px) {
  .vk-button {
    line-height: 15px;
    text-align: center;
    text-decoration: none;
    background: none;
    border: 0;
    border-radius: 4px;
    padding: 7px 16px 8px;
    margin: 0;
    font-size: var(--font-size-sm);
    display: block;
    zoom: 1;
    cursor: pointer;
    white-space: nowrap;
    box-sizing: border-box;
    font-family: var(--desktop-font);
    width: 100%;
  }
  .vk-button-disabled-by-loading .vk-button-disabled {
    font-size: 0;
    position: relative;
  }
  .vk-button-disabled-by-loading .vk-button-disabled::before,
  .vk-button-disabled-by-loading .vk-button-disabled::after {
    content: '';
    position: absolute;
    height: 4px;
    width: 4px;
    top: calc(50% - 2px);
    border-radius: 50%;
    animation-duration: 750ms;
    animation-direction: normal;
    animation-iteration-count: infinite;
    animation-play-state: running;
    animation-timing-function: linear;
    animation-delay: 0s;
  }
  .vk-button-disabled-by-loading .vk-button-disabled::before {
    background-color: rgb(224, 232, 241, 0.2);
    box-shadow: -6px 0 0 rgb(224, 232, 241, 1);
    animation-name: loadingBefore;
  }

  .vk-button-disabled::after {
    left: calc(50% + 6px);
    background-color: rgb(224, 232, 241, 0.2);
    animation-name: loadingAfter;
  }
}
@media screen and (max-width: 750px) {
  .vk-button {
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    padding: 9px 16px;
    border-radius: 8px;
    height: 32px;
    border: none;
    display: inline-block;
    width: auto;
    text-decoration: none;
  }
  .vk-button-disabled {
    opacity: 0.8;
  }
}
.vk-button-disabled {
  cursor: not-allowed !important;
}
</style>
