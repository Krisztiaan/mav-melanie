import React from 'react'
import { observer, inject } from "mobx-react/native"
import { Card, Caption, Subtitle, Title, Text, View, TextInput } from '@shoutem/ui'
import RoutePlanStore from '@stores/RoutePlanStore';

interface Props {
  routePlanStore: RoutePlanStore
}

@inject('routePlanStore')
@observer
export default class SearchBox extends React.PureComponent<Props> {
  render() {
    const {
      from,
      to,
      stops,
      date,
      dateType,
      conditions,
      services,
      passengers,
      searchStation,
      stationSearchText
    } = this.props.routePlanStore
    return (
      <View>
        <Card>
          <View>
            <Caption>Kereses</Caption>
            <Subtitle>Honnan: </Subtitle>
            <TextInput value={searchStation === 'from' ? stationSearchText : ''} onFocus={() => searchStation = 'from'}/>
          </View>
        </Card>
      </View>
    )
  }
}
