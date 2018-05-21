import React from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import { MapView } from 'expo'

import generatedMapStyle from './googleMapsConfig.json'

export default class SearchScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden={true} />
        <MapView
          style = { styles.container }
          provider = { MapView.PROVIDER_GOOGLE }
          customMapStyle = { generatedMapStyle }
          initialRegion={{
            latitude: 45.98323841436206,
            latitudeDelta: 11.941377300091823,
            longitude: 19.3582571670413,
            longitudeDelta: 7.982089743018152,
          }}
        />
      </View>
    );}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
