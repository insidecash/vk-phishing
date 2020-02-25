module.exports = function extensionFactory(fn, meta = null) {
  const extAction = fn.bind(null)
  const metaValue = typeof meta === 'function' ? meta() : meta

  Object.defineProperty(extAction, '__meta__', {
    __proto__: null,
    set() {
      throw new TypeError(
        `Metadata of extension is immutable, extID: ${metaValue.name}`
      )
    },

    get() {
      return metaValue
    }
  })

  return extAction
}
