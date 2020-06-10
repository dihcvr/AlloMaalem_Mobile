import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const ScreenContainer = ({children}) => (
  <View style={styles.container}>{children}</View>
);
export default class Splash extends React.Component {
  render() {
    return (
      <ScreenContainer>
        <View>
          <Image source={require('../img/222.png')} />
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    textAlign: 'center',
    color: '#3B5998',
    fontFamily: 'segoescb',
    fontSize: 25,
    marginBottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
