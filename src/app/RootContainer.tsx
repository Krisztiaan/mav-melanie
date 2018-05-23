import React from 'react'
import { View, StatusBar } from 'react-native'
import { Text } from '@shoutem/ui'
import { NativeRouter } from 'react-router-native'
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router'
import MainScreen from './modules/main/MainScreen'

export default class RootContainer extends React.Component {
  render() {
    return (
      <NativeRouter initialEntries={["/main"]}>
        <View style={{ flex: 1 }}>
          <StatusBar hidden={false} />
            <Route path="/main" component={MainScreen} />
            <Route path="/buy" render={() => <Text>Review data, Payment method, Fingerprint, Cancel page, Payment page</Text>} />
        </View>
      </NativeRouter>
    );}
}
