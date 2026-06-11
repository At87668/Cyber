function highlightFix() {
  return {
    postcssPlugin: 'postcss-highlight-fix',
    Once() {},
    Rule(rule) {
      try {
        if (rule.selector && rule.selector.includes('::highlight(')) {
          rule.selector = rule.selector.replaceAll('::highlight(', ':highlight(')
        }
      } catch {
        // ignore
      }
    },
  }
}
highlightFix.postcss = true

module.exports = {
  plugins: [
    highlightFix,
    'tailwindcss',
    'autoprefixer',
  ],
}