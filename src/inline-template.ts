import * as ts from 'typescript'
import * as path from 'path'
import * as fs from 'fs'

import * as sass from 'node-sass';

function buildSass(content: string, srcFile: string): string {
  return srcFile.endsWith('.scss') 
    ? sass.renderSync({ data: content, file: srcFile, outputStyle: 'compressed' }).css.toString() 
    : content;
}

function createTemplate(filePath: string, property: ts.PropertyAssignment) {
  property.name = ts.createIdentifier('template')
  const templateUrl = property.initializer.getText().replace(/'/g, '')
  const templateFullPath = path.resolve(path.dirname(filePath), templateUrl)
  property.initializer = ts.createStringLiteral(fs.readFileSync(templateFullPath, 'utf8'))
  return property
}

function createStyle(filePath: string, property: ts.PropertyAssignment) {
  property.name = ts.createIdentifier('style')
  const styleUrl = property.initializer.getText().replace(/'/g, '')
  const styleFullPath = path.resolve(path.dirname(filePath), styleUrl)
  const content = buildSass(fs.readFileSync(styleFullPath, 'utf8'), styleFullPath)
  property.initializer = ts.createStringLiteral(content)
  return property
}

function inlineTemplateProperties(filePath: string, properties: ts.NodeArray<ts.ObjectLiteralElementLike>) {
  return properties.map(property => {   
    if (ts.isPropertyAssignment(property)) {
      if (property.getText().includes('templateUrl')) {
        return createTemplate(filePath, property)
      }
      if (property.getText().includes('styleUrl')) {
        return createStyle(filePath, property)
      }
    }
    return property
  }) 
}

export function inlineTemplate(filePath) {
  return (context) => {
    const visitor = (node) => {
      if (Array.isArray(node.statements)) {
        node.statements.map(statement => {
          if (ts.isClassDeclaration(statement)) {
            statement.decorators.map(decorator => {
              /// @ts-ignore
              decorator.expression.arguments.map(argument => {
                if (ts.isObjectLiteralExpression(argument)) {
                  /// @ts-ignore
                  argument.properties = [ ...inlineTemplateProperties(filePath, argument.properties) ]
                }
                return argument
              })
            })
          }
          return statement
        })
      }
      return ts.visitEachChild(node, (child) => visitor(child), context);
    }
    return visitor
  }
}