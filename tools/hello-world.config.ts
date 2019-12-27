import { inlineTemplateTransform } from 'rollup-plugin-inline-custom-elements-ts'

export default {
  plugins: {
    before: [ inlineTemplateTransform() ]
  }
}