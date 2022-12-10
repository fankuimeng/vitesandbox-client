const ts = require('typescript')

export function tsTojs(key, value) {
  let result = value
  if (key?.endsWith('.ts') || key?.endsWith('.tsx')) {
    result = ts.transpileModule(value, {
      compilerOptions: { module: ts.ModuleKind.ESNext, jsx: 1 },
    })?.outputText
  }
  if (key.endsWith('.vue')) {
    const reg = /<script.*?>([\s\S]+?)<\/script>/im
    let strTemp = value.match(reg)[0]
    let str = strTemp?.replace(/<script.*?>/im, '').replace(/<\/script>/im, '')
    if (strTemp.indexOf('ts') > -1) {
      result = ts.transpileModule(str, {
        compilerOptions: { module: ts.ModuleKind.ES2020 },
      })?.outputText
    }
    result = `<script setup>
${result}</script>`.trim()
    result = value.replace(reg, result)
  }
  return result
}
