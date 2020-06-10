import React, {Component} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {
  DefaultTheme,
  Provider as PaperProvider,
  Portal,
  Text,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {Container, Fab} from 'native-base';
import {BackHandler, DeviceEventEmitter, TouchableOpacity} from 'react-native';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

export default class SelectPostion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      lat: null,
      lang: null,
      markers: null, // Here it is
    };
  }
  openGPS = () => {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message:
        "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: 'YES',
      cancel: 'NO',
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
      preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
      providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
    })
      .then(function(success) {
        console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
      })
      .catch(error => {
        console.log(error.message); // error.message => "disabled"
      });

    BackHandler.addEventListener('hardwareBackPress', () => {
      //(optional) you can use it if you need it
      //do not use this method if you are using navigation."preventBackClick: false" is already doing the same thing.
      LocationServicesDialogBox.forceCloseDialog();
    });

    DeviceEventEmitter.addListener('locationProviderStatusChange', function(
      status,
    ) {
      // only trigger when "providerListener" is enabled
      console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
    });
    this.requestLocationPermission();
  };
  componentDidMount() {
    this.openGPS();
  }
  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      // console.log('iPhone: ' + response);

      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      // console.log('Android: ' + response);

      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    }
  };
  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        // console.log(JSON.stringify(position));

        let initialPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        };
        this.setState({
          lat: position.coords.latitude,
          lang: position.coords.longitude,
        });
        this.setState({initialPosition});
      },
      error => {},
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Container>
          <View style={{flex: 1}}>
            <MapView
              sho
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              showsUserLocation={true}
              initialRegion={this.state.initialPosition}
              onPress={e => {
                this.setState({
                  marker: e.nativeEvent.coordinate,
                  lat: e.nativeEvent.coordinate.latitude,
                  lang: e.nativeEvent.coordinate.longitude,
                });
              }}>
              {this.state.marker && <Marker coordinate={this.state.marker} />}
            </MapView>
            <Fab
              active={this.state.active}
              style={styles.fab}
              position="topLeft"
              onPress={() =>
                this.props.navigation.navigate('AddService', {
                  lat: this.state.lat,
                  lang: this.state.lang,
                })
              }>
              <Icon name="arrow-left" />
            </Fab>
          </View>
        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {...StyleSheet.absoluteFillObject},
  map: {...StyleSheet.absoluteFillObject},
  fab: {
    backgroundColor: '#3B5998',
    borderRadius: 15,
    width: 80,
  },
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#000000',
    accent: 'yellow',
  },
};
