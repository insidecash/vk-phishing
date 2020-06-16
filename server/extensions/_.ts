export default function extensionFactory<fn extends Function, meta extends any>(
  fn: fn,
  meta: meta
): fn & { __meta__: meta } {
  const extAction = fn.bind(null)
  const metaValue = typeof meta === 'function' ? meta() : meta

  Object.defineProperty(extAction, '__meta__', {
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
