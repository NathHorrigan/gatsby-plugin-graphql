# Gatsby Plugin GraphQl! 🚀

Gatsby plugin for sourcing data from external GraphQl endpoints


<details>
 <summary><strong>Table of Contents</strong> (click to expand)</summary>

* [Installation](#-installation)
* [Usage](#️-usage)
* [Configuration](#️-configuration)
* [Todo](#️-todo)
* [License](#-license)
</details>


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
## ▶️ Usage

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
        queries: {
          type: 'starwars',
          path: `${__dirname}/src/queries/`,
        }
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
          {starwars.allPersons.map(person => (
            <li>{person.name}</li>
          ))}
        </ul>
      </div>
    )
}

export const query = graphql`
  query StarwarsChars {
    starwars {
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
  }
`
````


<br />
## 📝 Todo

- [ ] Authentication
- [ ] Multiple GraphQl endpoints

<br />
## 🎓 License

[MIT](http://webpro.mit-license.org/)