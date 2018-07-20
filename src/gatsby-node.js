import { request } from 'graphql-request'
import fs from 'fs'
import path from 'path'
import * as crypto from 'crypto'

fs.readFileAsync = function (filename) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(filename, "utf8", function(err, buffer){
        if (err) reject(err); else resolve(buffer);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export const sourceNodes = async (
  {boundActionCreators, reporter},
  configOptions
) => {
  const {createNode} = boundActionCreators
  const {endpoint, queries} = configOptions
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
    configs.map(async ({ type, path, recursive }) => {
      let data = {}
      const files = await getAllFiles(path, recursive)
      if (files) {
        Promise.all(files.map(file => fs
          .readFileAsync(file)
          .then(query => request(endpoint, query)
              .then(result => {
                data = {...data, ...result}
              }))
          .catch(err => reject(`${file} does not exist`))
        ))
        .then(() => {
          const content = JSON.stringify(data)
          const contentDigest = createContentDigest(content)
          const child = {
            ...data,
            id: `__graphql__${contentDigest}`,
            parent: null,
            children: [],
            internal: {
              type: 'wagtail',
              content,
              contentDigest
            }
          }
          createNode(child)
        })
      }
      resolve()
    })
  })
}

export const getAllFiles = (dir, recursive = true) => new Promise((resolve, reject) => {
  let files = []
  if (recursive) {
    files = fs.readdirSync(dir).reduce((files, file) => {
      const name = path.join(dir, file)
      const isDirectory = fs.statSync(name).isDirectory()
      return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
    }, [])
  } else {
    files = fs.readdirSync(dir)
      .map(file => path.join(dir, file))
      .filter(name => fs.statSync(name).isFile())
  }
  resolve(files)
})

const createContentDigest = content =>
  crypto
    .createHash('md5')
    .update(content)
    .digest('hex')
