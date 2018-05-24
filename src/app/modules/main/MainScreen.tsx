import React from 'react'
import { StatusBar, TouchableOpacity } from 'react-native';
import { Screen, View, Card, Text, Caption, TextInput } from '@shoutem/ui'
import { MapView } from 'expo'
import { Route, Link, RouteComponentProps, match, Redirect } from 'react-router-native'
import { Location } from 'history'
import { MaterialCommunityIcons, MaterialCommunityIconsProps } from '@expo/vector-icons'

import generatedMapStyle from './googleMapsConfig.json'
const hungaryRegion = {
  longitudeDelta: 7.060023397207258,
  latitudeDelta: 5.635177680611903,
  longitude: 19.483756721019745,
  latitude: 47.890610093493045
}

export default class MainScreen extends React.Component<RouteComponentProps<{}>> {
  componentDidMount () {
    this.props.history.push(`${this.props.match.url}/${defaultFeature}`)
  }

  render() {
    console.log(this.props)
    const { match, location } = this.props
    const currentFeature = location.pathname.substr(match.path.length + 1).split('/')[0] as keyof MenuFeatures
    if(!currentFeature) return null
    return (
      <Screen style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <MapView
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
          provider={MapView.PROVIDER_GOOGLE}
          customMapStyle={generatedMapStyle }
          initialRegion={hungaryRegion}
          mapPadding={{
            bottom: 220
          }}
        />
        <View style={{ flex: 1 }} pointerEvents="box-none">
          <View style={{
            paddingTop: 32,
            paddingHorizontal: 16,
            flexDirection: 'row',
            shadowColor: '#777',
            shadowRadius: 5,
            shadowOpacity: 0.1,
            shadowOffset: { width: 2, height: 4 },
          }}>
            <Card style={{
              flex: 1,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#fff',
              overflow: 'hidden',
              elevation: 1,
            }}>
              <TextInput placeholder="Indulo allomas"/>
            </Card>
          </View>
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
              { MenuFeatures[currentFeature].pageContent }
            </View>
            <View style={{
              justifyContent: 'flex-end',
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
              <View style={{ height: 60, flexDirection: 'row', paddingBottom: 8 }}>
                { Object.entries(MenuFeatures).map(menu => <MenuButton key={menu[0]} item={menu[1]} match={match} location={location}/>) }
              </View>
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
          paddingHorizontal: 16
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            shadowColor: '#777',
            shadowRadius: 9,
            shadowOpacity: 0.3,
            shadowOffset: { width: 2, height: 7 },
          }}>
            <Card style={{
              flex: 1,
              backgroundColor: '#FFF',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#fff',
              overflow: 'hidden',
            }}>
              <View styleName="content">
                { MenuFeatures[currentFeature].cardContent }
              </View>
            </Card>
          </View>
        </View>
      </Screen>
    )
  }


}

const MenuButton = ({ match, item, location }: { match: match<{}>, location: Location, item: MenuFeature}) => {
  return (
    <View  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Link to={`${match.url}/${item.path}`} component={TouchableOpacity} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <View styleName='vertical h-center' style={{ padding: 12 }}>
          <MaterialCommunityIcons name={item.icon.name} size={32} color={location.pathname === `${match.url}/${item.path}` ? '#2e5ea8' : '#777'} />
          { false && <Caption>{item.name}</Caption> }
        </View>
      </Link>
    </View>
  )
}

interface MenuFeature {
  name: string
  icon: MaterialCommunityIconsProps
  path: string
  isInBottomBar: boolean
  cardContent: React.ReactChild
  pageContent: React.ReactChild
  autoOpenPage?: boolean
}

interface MenuFeatures { [key: string]: MenuFeature }

const defaultFeature = 'news'
const MenuFeatures: MenuFeatures = {
  news: {
    name: 'Hírek',
    icon: {
      name: 'newspaper'
    },
    path: 'news',
    isInBottomBar: true,
    autoOpenPage: false,
    cardContent: <Caption>news</Caption>,
    pageContent: <Caption>news PAGE</Caption>,
  },
  timetable: {
    name: 'Menetrend',
    icon: {
      name: 'timetable'
    },
    path: 'timetable',
    isInBottomBar: true,
    autoOpenPage: false,
    cardContent: <Caption>timetable</Caption>,
    pageContent: <Caption>timetable PAGE</Caption>,
  },
  tickets: {
    name: 'Jegyek',
    icon: {
      name: 'ticket-confirmation'
    },
    path: 'tickets',
    isInBottomBar: true,
    autoOpenPage: false,
    cardContent: <Caption>tickets</Caption>,
    pageContent: <Caption>tickets PAGE</Caption>,
  },
  settings: {
    name: 'Beállítások',
    icon: {
      name: 'settings'
    },
    path: 'settings',
    isInBottomBar: true,
    autoOpenPage: false,
    cardContent: <Caption>settings</Caption>,
    pageContent: <Caption>settings PAGE</Caption>,
  }
}
