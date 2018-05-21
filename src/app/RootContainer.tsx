import React from 'react'
import { View, StatusBar } from 'react-native'
import { NativeRouter } from 'react-router-native'
import { Route } from 'react-router'
import RoutesSearchScreen from './modules/routes-search/RoutesSearchScreen'

export default class RootContainer extends React.Component {
  render() {
    return (
      <NativeRouter>
        <View style={{ flex: 1 }}>
          <StatusBar hidden={false} />
          <Route>
            <RoutesSearchScreen />
          </Route>
        </View>
      </NativeRouter>
    );}
}
