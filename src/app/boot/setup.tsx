import * as Expo from "expo"
import * as React from "react"
import { Provider } from "mobx-react/native"

import { MavDb } from '@services/database'
import { MavApi } from '@services/api'

import App from "../RootContainer";
export interface Props {}
export interface State {
  isReady: boolean,
}
export default function(stores: any[]) {
  return class Setup extends React.Component<Props, State> {
    state: {
      isReady: boolean,
    };
    constructor(props: {}) {
      super(props);
      this.state = {
        isReady: false,
      };
    }
    componentWillMount() {
      this.loadHeavy();
    }
    async loadHeavy() {
      await Expo.Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      });

      if (!await MavDb.getBasicInfo()) {
        try {
          const basicInfo = await MavApi.getBasicInfo()
          if (basicInfo.kind === 'ok') {
            await MavDb.saveBasicInfo(basicInfo.data)
          } else {
            console.warn(basicInfo)
          }
        } catch (error) {
          console.warn(error);
        }
      }

      this.setState({ isReady: true });
    }

    render() {
      if (!this.state.isReady) {
        return <Expo.AppLoading />;
      }
      return (
        <Provider {...stores}>
          <App />
        </Provider>
      );
    }
  };
}
