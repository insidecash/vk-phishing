import { mount } from '@vue/test-utils'
import VKButton from '@/components/VKButton'
import HideM from '@/components/HideM'
import HidePC from '@/components/HidePC'
import LanguageSelector from '@/components/LanguageSelector'

describe('VK Button component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(VKButton)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('can be Button', () => {
    const wrapper = mount(VKButton)

    wrapper.setProps({ type: 'button' })
    expect(wrapper.contains('.vk-button-wrapper button.vk-button')).toBeTruthy()
  })

  test('can be Submit', () => {
    const wrapper = mount(VKButton)

    wrapper.setProps({ type: 'submit' })
    expect(
      wrapper.contains('.vk-button-wrapper label.vk-button input')
    ).toBeTruthy()
  })

  test('can be Link', () => {
    const wrapper = mount(VKButton)

    wrapper.setProps({ type: 'link' })
    expect(wrapper.contains('.vk-button-wrapper a.vk-button')).toBeTruthy()
  })

  test('can be disabled', () => {
    const wrapper = mount(VKButton)

    wrapper.setProps({ disabled: true })
    expect(
      wrapper.contains('.vk-button-wrapper .vk-button.vk-button-disabled')
    ).toBeTruthy()
  })

  test('can be variable', () => {
    const wrapper = mount(VKButton)

    wrapper.setProps({ variant: 'test' })

    expect(
      wrapper.contains('.vk-button-wrapper .vk-button.vk-button-test')
    ).toBeTruthy()
  })
})

describe('Hide on mobile component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(HideM)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})

describe('Hide on desktop component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(HidePC)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})

describe('Language selector component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(LanguageSelector)

    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
