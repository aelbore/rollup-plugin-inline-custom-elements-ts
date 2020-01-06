import { inlineTemplateTransform } from 'rollup-plugin-inline-custom-elements-ts'
import { copy } from 'aria-build'

export default {
  plugins: {
    before: [ inlineTemplateTransform() ],
    after: [
      copy({
        targets: [
          { src: './tools/index.html', dest: './public' }
        ]
      })
    ]
  }
}