# Gatsby Plugin GraphQl! 🚀

Gatsby plugin for sourcing data from external GraphQl endpoints

<br />

<details>
 <summary><strong>Table of Contents</strong> (click to expand)</summary>

* [Installation](#-installation)
* [Usage](#️-usage)
* [Todo](#️-todo)
* [License](#-license)
</details>

<br />

## Features

* **Simple** configuration (& code if you want to build ontop of this).
* Support for configuring all fetch options to support things like Authentication.
* No weird pre/post fixes on type names; fully customizable!
* Option to transform node data before gatsby gets hold of it.


<br />

## 💾  Installation

NPM:
```
npm install --save gatsby-plugin-graphql
```

Yarn:
```
yarn add gatsby-plugin-graphql
```

<br />

## ▶️  Usage

##### gatsby-config.js:
```js
module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-graphql',
      options: {
        endpoint: 'https://api.graphcms.com/simple/v1/swapi',
        typePrefix: '', // OPTIONAL: set a prefix for each GQL type.
        queries: [{
          type: 'persons',
          path: `${__dirname}/src/queries/persons.graphql`,
          extractKey: 'persons', // OPTIONAL: Used to extra the data from the graphql JSON response (Example: { persons: [...] }). Usefull if you want your type to named different to the type name from the endpoint.
          transform: data => ({ ...data, isStarwarsCharacter: true })  // OPTIONAL: Used to mutate the GQL node data. It is called with each node before it is passed to gatsby's createNode function.
        }]
      },
    }
  ],
}

```

##### gatsby-site/src/queries/starwars.graphql:
```
query StarwarsChars { 
    allPersons {
        name
        species {
            name
        }
        homeworld {
            name
        }
    }
}
````

##### gatsby-site/src/pages/index.js:
```jsx
import React from "react";

export default ({data: { starwars }}) => {
    return (
      <div>
        <h2>Starwars Characters</h2>
        <ul>
          {starwars.allPersons.edges.nodes.map(person => (
            <li>{person.name}</li>
          ))}
        </ul>
      </div>
    )
}

export const query = graphql`
  query StarwarsChars {
    allPersons {
      edges {
        node {
          name
          species {
              name
          }
          homeworld {
              name
          }
        }
      }
    }
  }
`
````

<br />

## 🎓 License

[MIT](http://webpro.mit-license.org/)