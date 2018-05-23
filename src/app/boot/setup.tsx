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
        FontAwesome: require("@expo/vector-icons/fonts/FontAwesome.ttf"),
        MaterialCommunityIcons: require("@expo/vector-icons/fonts/MaterialCommunityIcons.ttf"),
				'Rubik-Black': require('@node_modules/@shoutem/ui/fonts/Rubik-Black.ttf'),
				'Rubik-BlackItalic': require('@node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf'),
				'Rubik-Bold': require('@node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf'),
				'Rubik-BoldItalic': require('@node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf'),
				'Rubik-Italic': require('@node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf'),
				'Rubik-Light': require('@node_modules/@shoutem/ui/fonts/Rubik-Light.ttf'),
				'Rubik-LightItalic': require('@node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf'),
				'Rubik-Medium': require('@node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf'),
				'Rubik-MediumItalic': require('@node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf'),
				'Rubik-Regular': require('@node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf'),
				'rubicon-icon-font': require('@node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf')
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
