// Converts a "prop:value;prop2:value2" CSS string (as produced by the
// template-literal style builders ported from the original design) into a
// React style object. Lets that logic stay in its original, easy-to-audit
// string form instead of being hand-transcribed into object literals.
export function styleObj(css) {
  if (!css) return undefined
  return css.split(';').reduce((acc, decl) => {
    const idx = decl.indexOf(':')
    if (idx === -1) return acc
    const prop = decl.slice(0, idx).trim()
    const val = decl.slice(idx + 1).trim()
    if (!prop || !val) return acc
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    acc[camel] = val
    return acc
  }, {})
}
