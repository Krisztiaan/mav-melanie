import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { getRoutePlan } from './api/api'
import { PassengerDiscount, PassengerType, TicketService } from './api/models'
import moment from 'moment'

interface ApiEndpointProps {
  name: string
  call: Promise<any>
}

enum LoadingStatus {
  INITIAL,
  LOADING,
  SUCCESS,
  ERROR
}

interface ApiEndpointState {
  status: LoadingStatus
  data?: any
  error?: any
}

class ApiEndpoint extends React.Component<ApiEndpointProps, ApiEndpointState> {
  state: ApiEndpointState = {
    status: LoadingStatus.INITIAL
  }

  load = async () => {
    console.log('start')
    this.setState({ status: LoadingStatus.LOADING })
    try {
      console.log('start2')
      const data = await this.props.call
      this.setState({ status: LoadingStatus.SUCCESS, error: undefined, data: data.data.UtazasiAjanlatok })
      console.log(data.data)
    } catch (error) {
      console.log(error)
      this.setState({ status: LoadingStatus.ERROR, error, data: undefined })
    }
  }

  render() {
    return (
      <ScrollView style={{ paddingTop: 50 }}>
        <TouchableOpacity onPress={this.load}>
          <View>
            <Text>Type: {this.props.name}</Text>
          </View>
        </TouchableOpacity>
        <Text>
          { JSON.stringify(this.state.data ? this.state.data : this.state.error) }
        </Text>
      </ScrollView>
    )
  }
}

export default class ApiTester extends React.PureComponent {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ApiEndpoint
          name="GetRoutePlan"
          call={getRoutePlan({
            fromId: "005510009",
            toId: "005501289",
            startDate: moment(),
            services: [ TicketService.SECOND_CLASS ],
            passengers: [
              {
                CsakFelarJel: false,
                FogyatekkalElo: false,
                Kedvezmenyek: [
                  PassengerDiscount.BKK_PASS,
                  PassengerDiscount.STUDENT_DAY_NIGHT
                ],
                Mennyiseg: 1,
                UtasTipus: PassengerType.OVER_18_UNDER_26,
                f: 0
              }
            ]
          })}
        />
      </View>
    )
  }
}