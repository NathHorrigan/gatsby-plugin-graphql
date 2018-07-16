import { request } from 'graphql-request'
import fs from 'fs'
import path from 'path'
import * as crypto from 'crypto'

export const sourceNodes = async (
  { boundActionCreators, reporter },
  configOptions
) => {
  const { createNode } = boundActionCreators
  const { endpoint, queries, recursive } = configOptions
  let configs = []

  if (!endpoint) {
    throw 'No endpoint was passed to plugin'
  }

  if (Array.isArray(queries)) {
    configs = queries
  } else {
    configs = [queries]
  }

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  return new Promise((resolve, reject) => {
    configs.map(({ type, path, recursive }) => {
      getAllFiles(path, recursive).map(file => {
        fs.readFile(file, 'utf8', async (err, query) => {
          if (err) {
            reject(`${file} does not exist`)
          }

          const result = await request(endpoint, query)

          const content = JSON.stringify(result)
          const contentDigest = createContentDigest(content)

          const child = {
            ...result,
            id: `__graphql__${contentDigest}`,
            parent: null,
            children: [],
            internal: {
              type,
              content,
              contentDigest
            }
          }

          createNode(child)
          resolve()
        })
      })
    })
  })
}

export const getAllFiles = (dir, recursive = true) => {
  if (recursive) {
    return fs.readdirSync(dir).reduce((files, file) => {
      const name = path.join(dir, file)
      const isDirectory = fs.statSync(name).isDirectory()
      return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
    }, [])
  } else {
    return fs
      .readdirSync(dir)
      .map(file => path.join(dir, file))
      .filter(name => fs.statSync(name).isFile())
  }
}

const createContentDigest = content =>
  crypto
    .createHash('md5')
    .update(content)
    .digest('hex')
