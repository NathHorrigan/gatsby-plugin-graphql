import { GraphQLClient, request } from 'graphql-request'
import fs from 'fs'
import createNodeHelpers from 'gatsby-node-helpers'


export const sourceNodes = async ({ boundActionCreators, reporter }, configOptions) => {
  const { createNode } = boundActionCreators
  const { endpoint, queries, fetchOptions, typePrefix = '' } = configOptions
  const { createNodeFactory } = createNodeHelpers({
    typePrefix,
  })

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins

  if (!endpoint) {
    throw 'No endpoint was passed to plugin'
  }

  const client = new GraphQLClient(endpoint, fetchOptions)

  return new Promise((resolve, reject) => queries.map(async config => {
    let { type, path, extractKey, transform } = config

    const GQLNode = createNodeFactory(type, node => node)
  
    const nodes = await fs.readFileAsync(path).then(async query => {
      const result = await client.request(query)
      let data = (extractKey) ? result[extractKey] : result[type]
      transform = transform ? transform : data => data
      return data
        .map(transform)  
        .map(GQLNode)
    })
    nodes.map(node => createNode(node))
    resolve()
  }))
}

fs.readFileAsync = function (filename) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(filename, 'utf8', function (err, buffer) {
        if (err) {
          reject(err)
        } else {
          resolve(buffer)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}