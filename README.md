# React Native + ExNavigation + Relay

This is a sample repository that shows how to integrate React Native with [ExNavigation](https://github.com/exponentjs/ex-navigation) and Relay

It is connecting to this boilerplate code [graphql-dataloader-boilerplate](https://github.com/sibelius/graphql-dataloader-boilerplate)

![alt tag](https://github.com/sibelius/ExNavRelay/blob/master/demo/demo.gif)

## Description
- data folder contains schema(.json/.graphql) of your backend graphql server, it will be used by Relay to compile your Relay.QL queries to code.
- plugins folder has babelRelayPlugin configuration, that tells to Relay with schema.json it should use to compile Relay.QL queries

.babelrc for Relay
```json
{
    "presets": [
        "react-native",
        "react-native-stage-0/decorator-support"
    ],
    "plugins": [
        "./plugins/babelRelayPlugin"
    ],
}
```
Obs.: react-native-stage-0/decorator-support is to enable `@withNavigation` needed by ex-navigation

### RelayStore.js
It is a custom Relay.Store that enables you to change your Network Layer. For instance, when you want to set the user token.

- Usage:
```js
RelayStore.reset(
  new Relay.DefaultNetworkLayer('http://localhost:5000/graphql')
);
```

### RelayUtils.js
Based on https://gist.github.com/janicduplessis/f513032eb37cdde5d050d9ce8cf0b92a by @janicduplessis
Provides a very handy function to create a Relay.Renderer container to fetch data from Relay

- Usage:
```jsx
import { createRenderer } from './RelayUtils'
export default createRenderer(RelayApp, {
  queries: ViewerQuery,
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        users(first: 10) {
          edges {
            node {
              name
            }
          }
        }
      }
    `,
  },
});
```

### Ex-Navigation + Relay
1. You should use `createRenderer` helper in any component that will be `pushed` into a `StackNavigation`
   - For instance, check [UserList.js](https://github.com/sibelius/ExNavRelay/blob/master/src/UserList.js)

- Pushing a route that uses Relay and depends on a parameter (https://github.com/sibelius/ExNavRelay/blob/master/src/UserList.js#L85)

- Define that your route will need a parameter from ex-navigation like these (https://github.com/sibelius/ExNavRelay/blob/master/src/UserDetail.js#L34)
- You also need to define it inside `initialVariables` (https://github.com/sibelius/ExNavRelay/blob/master/src/UserDetail.js#L37)


