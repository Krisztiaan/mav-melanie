import React from 'react'
import { StatusBar, TouchableOpacity, View, StyleSheet, Animated, LayoutAnimation } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Screen, View as ShView, Card, Text, Caption, Title, Subtitle, TextInput, Row, Button } from '@shoutem/ui'
import { MapView } from 'expo'
import { Route, Link, RouteComponentProps, match, Redirect } from 'react-router-native'
import { Location } from 'history'
import { MaterialCommunityIcons, MaterialCommunityIconsProps, Ionicons } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'
import { observer, inject } from 'mobx-react/native'
import moment from 'moment'

import generatedMapStyle from './googleMapsConfig.json'
import RoutePlanStore from '@stores/RoutePlanStore';
const hungaryRegion = {
  longitudeDelta: 7.060023397207258,
  latitudeDelta: 5.635177680611903,
  longitude: 19.483756721019745,
  latitude: 47.890610093493045
}

@inject("routePlanStore")
@observer
export default class MainScreen extends React.Component<RouteComponentProps<{}> & { routePlanStore: RoutePlanStore }> {

  state = {
    isPageOpen: false,
    isSearchOpen: false,
    isDateTimePickerVisible: false,
  }

  handleDateTimePicked = (date: Date) => {
    this.props.routePlanStore.setDate(moment(date), 'departure')
    this.setState({ isDateTimePickerVisible: false })
  }

  componentDidMount () {
    this.navigateToFeature(defaultFeature)
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
  }

  navigateToFeature = (feature: keyof MenuFeatures) => {
    this.props.history.push(`${this.props.match.url}/${feature}`)
  }

  render() {
    console.log(this.props)
    const { match, location, routePlanStore } = this.props
    const { isSearchOpen, isPageOpen } = this.state
    const currentFeatureKey = location.pathname.substr(match.path.length + 1).split('/')[0] as keyof MenuFeatures
    const currentFeature = MenuFeatures[currentFeatureKey]
    if(!currentFeature) return null
    return (
      <Screen style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <MapView
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
          provider={MapView.PROVIDER_GOOGLE}
          customMapStyle={generatedMapStyle }
          initialRegion={hungaryRegion}
          //@ts-ignore
          mapPadding={{
            bottom: 220
          }}
        />
        <View style={{ flex: 1 }} pointerEvents="box-none">
          <View style={{
            flexDirection: 'row',
            marginTop: 32,
            marginHorizontal: 16,
            shadowColor: '#777',
            shadowRadius: 9,
            shadowOpacity: 0.3,
            shadowOffset: { width: 5, height: 7 },
          }}>
            <Card style={{
              flex: 1,
              borderRadius: 8,
              borderWidth: 0,
              borderColor: '#fff',
              overflow: 'hidden',
              elevation: 1,
            }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 5 }}>
                  <TextInput
                    placeholder="Induló állomás"
                    onFocus={currentFeature.path !== 'search' ? (() => this.navigateToFeature('search')) : undefined}
                  />
                  { currentFeatureKey === 'search' ? <TextInput
                    style={{ }}
                    placeholder="Cél állomás"
                  /> : null }
                </View>
                <View style={{
                  alignSelf: 'stretch',
                  borderLeftColor: "#CCC",
                  borderLeftWidth: StyleSheet.hairlineWidth,
                }}/>
                { currentFeatureKey === 'search' ? <View style={{ flex: 4 }}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ isDateTimePickerVisible: true })}>
                    <View style={{ flexDirection: 'column', padding: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Subtitle styleName="bold">Nap</Subtitle>
                        <Ionicons name="ios-arrow-down" size={16} color="#777"/>
                      </View>
                      <Caption>{
                        `${routePlanStore.date.calendar().split(" ")[0]}${routePlanStore.date.calendar().split(" ")[0] === routePlanStore.date.format('dddd') ? '' : ', ' + routePlanStore.date.format('dddd')}`}</Caption>
                    </View>
                  </TouchableOpacity>
                  <View style={{
                    alignSelf: 'stretch',
                    borderBottomColor: "#CCC",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}/>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => this.setState({ isDateTimePickerVisible: true })}>
                    <View style={{ flexDirection: 'column', padding: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Subtitle styleName="bold">Indulás</Subtitle>
                        <Ionicons name="ios-arrow-down" size={16} color="#777"/>
                      </View>
                      <Caption>{routePlanStore.date.format('HH:mm')}</Caption>
                    </View>
                  </TouchableOpacity>
                </View> : null }
              </View>
            </Card>
              { isSearchOpen ? <View>
                <Text>Hello</Text>
                <Button>Kereses</Button>
                <Button>Jegyvasarlas</Button>
              </View> : null }
          </View>
          <View style={{
            backgroundColor: '#FFF',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 145,
            shadowColor: 'black',
            shadowRadius: 9,
            shadowOpacity: 0.3,
            shadowOffset: { width: 5, height: 7 }
          }}>
            <View style={{ flex: 1 }}>
              { currentFeature.pageContent }
            </View>
            <View style={{
              justifyContent: 'flex-end',
              backgroundColor: '#FFF',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: isPageOpen ? 70 : 145,
              shadowColor: 'black',
              shadowRadius: 9,
              shadowOpacity: 0.3,
              shadowOffset: { width: 5, height: 7 }
            }}>
              <View style={{ height: 60, flexDirection: 'row', paddingBottom: 8 }}>
                { Object.entries(MenuFeatures)
                  .filter(featureEntry => featureEntry[1].isInBottomBar)
                  .map(menu => <MenuButton key={menu[0]} item={menu[1]} match={match} location={location}/>) }
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
            { currentFeature.cardContent ? <CardContent item={currentFeature}/> : null }
        </View>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDateTimePicked}
          onCancel={() => this.setState({ isDateTimePickerVisible: false })}
          date={new Date(this.props.routePlanStore.date.valueOf())}
          mode="datetime"
        />
      </Screen>
    )
  }
}

const MenuButton = ({ match, item, location }: { match: match<{}>, location: Location, item: MenuFeature}) => {
  return (
    <View  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Link to={`${match.url}/${item.path}`} component={TouchableOpacity} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <View style={{ alignItems: 'center', padding: 12 }}>
          <MaterialCommunityIcons name={item.icon.name} size={32} color={location.pathname === `${match.url}/${item.path}` ? '#2e5ea8' : '#777'} />
          { false && <Caption>{item.name}</Caption> }
        </View>
      </Link>
    </View>
  )
}

const CardContent = ({ item }: { item: MenuFeature }) => (
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
      <ShView styleName="content">
        <ShView styleName="horizontal v-center">
          <MaterialCommunityIcons name={item.icon.name} size={24} color='#2e5ea8' />
          <View style={{ margin: 6 }}/>
          <Title>{item.name}</Title>
        </ShView>
        { item.cardContent }
      </ShView>
    </Card>
  </View>
)

interface MenuFeature {
  name: string
  icon: MaterialCommunityIconsProps
  path: string
  isInBottomBar?: boolean
  cardContent?: React.ReactChild
  pageContent?: React.ReactChild
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
  },
  search: {
    name: 'Keresés',
    icon: {
      name: 'account-search'
    },
    path: 'search',
    isInBottomBar: false,
    autoOpenPage: true,
    pageContent: <Caption>search PAGE</Caption>,
  }
}
