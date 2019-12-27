import * as ts from 'typescript'
import * as path from 'path'

import MagicString from 'magic-string'
import { inlineTemplate } from './inline-template'

const transpile = (filePath: string, source: string) => {
  const { outputText, sourceMapText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2015, 
      target: ts.ScriptTarget.ES2018,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      strictNullChecks: false,
      sourceMap: true
    },
    transformers: { 
      before: [ inlineTemplate(filePath) ]  
    }
  })
  return { code: outputText, map: sourceMapText }
}

export function inlineTemplateTransform() {
  return {
    name: 'inlineTemplateTransform',    
    transform (code: string, id: string) {  
      const magicString = new MagicString(code);
      if (!id.includes(path.join(path.resolve(), 'node_modules'))) {
        return transpile(id, magicString.toString())
      }
      return { 
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true })
      }
    }
  }
}