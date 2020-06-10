import * as React from 'react';

import {
  Appbar,
  DefaultTheme,
  Provider as PaperProvider,
  configureFonts,
} from 'react-native-paper';
import {
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
} from 'native-base';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Platform,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export default class ArtisanValide extends React.Component {
  render() {
    return (
      <PaperProvider theme={theme}>
        <Appbar.Header>
          <Appbar.Action
            icon="check-circle"
            onPress={() => console.log('Pressed archive')}
          />
          <Appbar.Content title="Les artisans validés" />
          <Appbar.Action icon="magnify" onPress={this._handleSearch} />
          <Appbar.Action icon="dots-vertical" onPress={this._handleMore} />
        </Appbar.Header>
      </PaperProvider>
    );
  }
}

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'CoreSansAR-55Medium',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'CoreSansAR-55Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'CoreSansAR-55Medium',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'CoreSansAR-55Medium',
      fontWeight: 'normal',
    },
  },
};
const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B5998',
    accent: 'yellow',
  },
};
