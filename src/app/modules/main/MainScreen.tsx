import React from 'react'
import { StatusBar, TouchableOpacity } from 'react-native';
import { Screen, View, Card, Text, Caption } from '@shoutem/ui'
import { MapView } from 'expo'
import { Route, Link, RouteComponentProps, match } from 'react-router-native';
import { MaterialCommunityIcons, MaterialCommunityIconsProps } from '@expo/vector-icons'

import generatedMapStyle from './googleMapsConfig.json'

export default class MainScreen extends React.Component<RouteComponentProps<{}>> {
  render() {
    console.log(this.props)
    const { match, location } = this.props
    return (
      <Screen style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <MapView
          style = {{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
          provider = { MapView.PROVIDER_GOOGLE }
          customMapStyle = { generatedMapStyle }
          initialRegion={{
            latitude: 45.98323841436206,
            latitudeDelta: 11.941377300091823,
            longitude: 19.3582571670413,
            longitudeDelta: 7.982089743018152,
          }}
        />
        <View style={{ flex: 1 }}>
          <View>
            <Text>Top bar</Text>
          </View>
          <View>
            <Text>Bottom bar</Text>
          </View>
          <Route exact path={`${match.url}`}>
            <Text>Simple search, and news</Text>
          </Route>
          <View style={{
            backgroundColor: '#FFF',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 120,
            shadowColor: 'black',
            shadowRadius: 9,
            shadowOpacity: 0.3,
            shadowOffset: { width: 5, height: 7 }
          }}>
            <View style={{ flex: 1 }}>
              <Text>
                PageContent
              </Text>
            </View>
            <View style={{ height: 100, flexDirection: 'row', paddingBottom: 6 }}>
              { MENUS.map(menu => <MenuItem key={menu.name} item={menu} match={match}/>)}
            </View>
          </View>
        </View>
        <View style={{
          position: 'absolute',
          flexDirection: 'row',
          left: 0,
          right: 0,
          bottom: 100,
          height: 120,
          paddingHorizontal: 32
        }}>
          <Card style={{
            flex: 1,
            backgroundColor: '#FFF',
            shadowColor: 'black',
            shadowRadius: 9,
            shadowOpacity: 0.3,
            shadowOffset: { width: 5, height: 7 },
          }}>
            <View styleName="content">
              <Text>CardContent</Text>
            </View>
          </Card>
        </View>
      </Screen>
    )
  }


}

const MenuItem = ({ match, item }: { match: match<{}>, item: Menu}) => {
  return (
    <View  style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Link to={`${match.url}/${item.path}`} component={TouchableOpacity}>
        <View styleName='vertical h-center'>
          <MaterialCommunityIcons name={item.icon.name} size={32} color={location.pathname === `${match.url}/${item.path}` ? '#2e5ea8' : '#333'} />
          <Caption>{item.name}</Caption>
        </View>
      </Link>
    </View>
  )
}

interface Menu {
  name: string
  icon: MaterialCommunityIconsProps
  path: string
}

const MENUS: Menu[] = [
  {
    name: 'HIREK',
    icon: {
      name: 'newspaper'
    },
    path: 'news',
  },
  {
    name: 'MENET',
    icon: {
      name: 'timetable'
    },
    path: 'timetable',
  },
  {
    name: 'UTAK',
    icon: {
      name: 'ticket-confirmation'
    },
    path: 'tickets',
  },
  {
    name: 'BEALLIT',
    icon: {
      name: 'settings'
    },
    path: 'settings',
  }
]
