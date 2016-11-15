// @flow
// reference code: https://gist.github.com/janicduplessis/f513032eb37cdde5d050d9ce8cf0b92a

import React from 'react';
import type { Element as ReactElement } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Relay from 'react-relay';
import RelayStore from './RelayStore';

type Variables = {[name: string]: mixed};

type Config = {
  queries: {[name: string]: any};
  queriesParams?: ?(props: Object) => Object;
  fragments: {[name: string]: any};
  initialVariables?: Variables;
  prepareVariables?: (prevVariables: Variables, route: any) => Variables;
  forceFetch?: bool;
  onReadyStateChange?: (readyState: any) => void;
  renderFetched?: (
    props: Object,
    fetchState: { done: bool; stale: bool }
  ) => ?ReactElement<any>;
  renderLoading?: () => ?ReactElement<any>;
  renderFailure?: (error: Error, retry: ?() => void) => ?ReactElement<any>;
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#cfcfcf',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
  },
});

const LoadingView = () => (
  <View style={styles.content}>
    <View style={styles.loading}>
      <ActivityIndicator />
    </View>
  </View>
);

const FailureView = ({ error, retry }) => (
  <View style={{ paddingTop: 46, alignItems: 'center' }}>
    <Text>Error</Text>
    <Text>{error.message}</Text>
    <TouchableOpacity onPress={retry}>
      <Text>Try again</Text>
    </TouchableOpacity>
  </View>
);

export function createRenderer(
  Component: ReactClass<*>,
  config: Config
): ReactClass<*> {
  return createRendererInternal(Component, {
    forceFetch: false,
    renderLoading: () => <LoadingView />,
    renderFailure: (error, retry) => <FailureView error={error} retry={retry} />,
    ...config,
  });
}

function createRendererInternal(
  Component: ReactClass<*>,
  config: Config
): ReactClass<*> {
  const {
    queries,
    queriesParams,
    forceFetch,
    renderFetched,
    renderLoading,
    renderFailure,
    onReadyStateChange,
    fragments,
    initialVariables,
    prepareVariables,
  } = config;

  const RelayComponent = Relay.createContainer(Component, {
    fragments,
    initialVariables,
    prepareVariables,
  });

  class RelayRendererWrapper extends React.Component {
    state = {
      queryConfig: this._computeQueryConfig(this.props),
    };

    render() {
      return (
        <Relay.Renderer
          Container={RelayComponent}
          forceFetch={forceFetch || false}
          onReadyStateChange={onReadyStateChange}
          queryConfig={this.state.queryConfig}
          environment={RelayStore}
          render={({ done, error, props, retry, stale }) => {
            if (error) {
              if (renderFailure) {
                return renderFailure(error, retry);
              }
            } else if (props) {
              if (renderFetched) {
                return renderFetched({ ...this.props, ...props }, { done, stale });
              } else {
                return <RelayComponent {...this.props} {...props} />;
              }
            } else if (renderLoading) {
              return renderLoading();
            }
            return undefined;
          }}
        />
      );
    }

    componentWillReceiveProps(nextProps: Object) {
      if (this.props.routeParams !== nextProps.routeParams) {
        this.setState({
          queryConfig: this._computeQueryConfig(nextProps),
        });
      }
    }

    _computeQueryConfig(props: Object) {
      const params = queriesParams ? queriesParams(props) : {};

      // remove parenthesis ( )
      const name  = `relay_route_${RelayComponent.displayName}`.replace(/[\(|\)]/g, '_');

      const queryConfig = {
        name,
        queries: { ...queries },
        params,
      };

      return queryConfig;
    }
  }

  if (Component.route) {
    RelayRendererWrapper.route = Component.route;
  }

  return RelayRendererWrapper;
}
