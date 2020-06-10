import * as React from 'react';
import {
  DefaultTheme,
  Provider as PaperProvider,
  Portal,
} from 'react-native-paper';

import {Col, Row, Grid} from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {Picker, Item} from 'native-base';
import {BackHandler, DeviceEventEmitter} from 'react-native';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Carousel from 'react-native-snap-carousel';
import Profile from './Profile';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
const server = 'https://backend.herayfi.com/';
const server2 = 'http://upload.herayfi.com/';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idUser: '',
      visible: true,
      markers: [],
      lat: '',
      long: '',
      coordinates: [],
      services: [],
      data: [],
      starCount: 3.5,
      search: '',
      value: 0,
      modalVisible: false,
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
        console.log('er gps=>' + error.message); // error.message => "disabled"
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
    setInterval(() => {
      this.requestLocationPermission();
    }, 1000);
  };
  async getToken(user) {
    try {
      let userData = await AsyncStorage.getItem('userData');
      let id = JSON.parse(userData);

      this.setState({
        idUser: id,
      });
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }

  componentDidMount() {
    this.getToken();
    this.openGPS();
    axios
      .get(server + 'artisans')
      .then(response => {
        this.setState({coordinates: response.data});
        //  console.log(response.data);
      })
      .catch(err => console.log('artisnss --> ' + err));
    axios
      .get(server + 'services')
      .then(response => {
        this.setState({services: response.data});
      })
      .catch(err => console.log('ssrvices --> ' + err));
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
        this.setState({
          lat: position.coords.latitude,
          lang: position.coords.longitude,
        });
        let initialPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        };
        this.setState({initialPosition});
      },
      error => {},
    );
  };
  onCarouselItemChange = index => {
    this.state.markers[index].showCallout();
    let location = this.state.coordinates[index];
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });
  };

  onMarkerPressed = (location, index) => {
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });

    this._carousel.snapToItem(index);
  };
  dialCall = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  renderCarouselItem = ({item}) => (
    <TouchableOpacity
      style={{
        flex: 1,

        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: 130,
      }}>
      <View
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: 130,
        }}>
        <Image
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: 10,
            height: 90,
            width: 130,
          }}
          source={{uri: server2 + item.profile}}
        />

        <View
          style={{
            padding: 10,
            width: 160,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.cardNom}>
            {item.nom} {item.prenom}
          </Text>
          <Text style={styles.cardService}>{item.label}</Text>
          <View style={styles.cardEtoile}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={item.rating}
              starSize={12}
              fullStarColor={'#D4AF37'}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  onValueChange(value) {
    this.setState({
      search: value,
    });
    if (value == '0') {
      axios
        .get(server + 'artisans')
        .then(response => {
          this.setState({coordinates: response.data});
        })
        .catch(er => console.log(err));
    } else {
      const ob = {
        id: value,
      };
      axios
        .post(server + 'artisansByService', ob)
        .then(response => {
          this.setState({coordinates: response.data});
        })
        .catch(err => console.log('er art byId=>' + err));
    }
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <Portal>
          <Item picker style={styles.search}>
            <Icon name="search" size={20} color={'#ccc'} style={styles.icon} />
            <Picker
              style={styles.picker}
              mode="dropdown"
              note={false}
              selectedValue={this.state.search}
              onValueChange={this.onValueChange.bind(this)}>
              <Picker.Item
                label="Rechercher par service"
                value={0}
                color="#c1c1c1"
              />
              {this.state.services.map(e => (
                <Picker.Item
                  label={e.label}
                  value={e.idService}
                  onValueChange={this.onValueChange.bind(this)}
                />
              ))}
            </Picker>
          </Item>
        </Portal>

        <MapView
          provider={PROVIDER_GOOGLE}
          ref={map => (this._map = map)}
          showsUserLocation={true}
          style={styles.map}
          initialRegion={this.state.initialPosition}>
          {this.state.coordinates.map((marker, index) => (
            <Marker
              key={marker.idArtisan}
              ref={ref => (this.state.markers[index] = ref)}
              onPress={() => this.onMarkerPressed(marker, index)}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              icon={server + marker.profile}>
              <Callout
                onPress={() => {
                  Alert.alert('', 'Choisir Appel ou voir le profile', [
                    {text: 'APPEL', onPress: () => this.dialCall(marker.phone)},
                    {
                      text: 'Voir profile',
                      onPress: () => {
                        this.props.navigation.navigate('Profile', {
                          name: marker.nom,
                          id: marker.idArtisan,
                        });
                      },
                    },
                    {
                      text: 'Cancel',

                      style: 'cancel',
                    },
                  ]);
                }}>
                <View
                  style={{
                    padding: 10,
                    paddingRight: 0,
                    width: 200,
                  }}>
                  <Grid>
                    <Col style={{width: '92%'}}>
                      <Grid>
                        <Col style={{width: '18%'}}>
                          <Image
                            style={{
                              borderRadius: 50,
                              height: 30,
                              width: 30,
                            }}
                            source={{uri: server2 + marker.profile}}
                          />
                        </Col>
                        <Col style={{width: '8%'}}>
                          <Text> </Text>
                        </Col>
                        <Col style={{width: '80%'}}>
                          <Text style={styles.cardNom}>
                            {marker.nom} {marker.prenom}
                          </Text>
                          <Text
                            style={{
                              color: '#ccc',
                              fontSize: 13,
                              fontWeight: 'bold',
                            }}>
                            {marker.label}
                          </Text>
                        </Col>
                      </Grid>
                      <Grid style={{marginTop: 10}}>
                        <Col style={{width: '18%', marginLeft: 5}}>
                          <Icon name="phone-square" color={'green'} size={20} />
                        </Col>
                        <Col style={{width: '3%'}}>
                          <Text> </Text>
                        </Col>
                        <Col style={{width: '80%'}}>
                          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                            {marker.phone}
                          </Text>
                        </Col>
                      </Grid>
                    </Col>
                    <Col
                      style={{
                        width: '8%',
                        paddingTop: 20,
                        backgroundColor: '#f2f2f2',
                      }}>
                      <Icon name="chevron-right" size={20} />
                    </Col>
                  </Grid>

                  <View style={styles.cardEtoile} />
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={this.state.coordinates}
          containerCustomStyle={styles.carousel}
          renderItem={this.renderCarouselItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={130}
          removeClippedSubviews={false}
          onSnapToItem={index => this.onCarouselItemChange(index)}
        />
      </PaperProvider>
    );
  }
}

export default function MapV() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    margin: 4,
    height: '30%',
  },
  cardService: {
    color: '#ccc',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardNom: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'CoreSansAR-55Medium',
  },
  cardEtoile: {
    fontSize: 10,
    alignSelf: 'center',
  },
  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginLeft: 9,
    margin: 9,
    height: '8%',
  },
  picker: {margin: 8, marginLeft: 10},
  icon: {marginLeft: 14},
  container: {...StyleSheet.absoluteFillObject},
  map: {...StyleSheet.absoluteFillObject},
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 2,
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
