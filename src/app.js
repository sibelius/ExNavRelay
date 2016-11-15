import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Relay from 'react-relay';
import {
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import ViewerQuery from './ViewerQuery';
import { createRenderer } from './RelayUtils';
import RelayStore from './RelayStore';
import Router from './Router';

RelayStore.reset(
  new Relay.DefaultNetworkLayer('http://localhost:5000/graphql')
);

export default class RelayApp extends Component {
  render() {
    console.log('relayApp: ', this.props);

    return (
      <NavigationProvider router={Router}>
        <StackNavigation
          id="master"
          initialRoute={Router.getRoute('userList')}
        />
      </NavigationProvider>
    );
  }
}
