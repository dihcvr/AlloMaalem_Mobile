import * as React from 'react';
import {
  DefaultTheme,
  Provider as PaperProvider,
  Button,
  Portal,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polygon,
  Circle,
} from 'react-native-maps';
import {Picker, Item} from 'native-base';
import {BackHandler, DeviceEventEmitter} from 'react-native';
import StarRating from 'react-native-star-rating';
import {Col, Row, Grid} from 'react-native-easy-grid';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Carousel from 'react-native-snap-carousel';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
export default class Search extends React.Component {
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
    };
    this.sauvgarder = this.sauvgarder.bind(this);
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

      axios.post('http://192.168.1.106:5000/artisans').then(response => {
        response.data.map(e => {
          const ob = {
            idArtisan: e.idArtisan,
          };
          setInterval(() => {
            axios
              .post('http://192.168.1.106:5000/getRating', ob)
              .then(response => {
                e.rating = response.data[0].ranting;
              });

            const ob2 = {idUser: this.state.idUser, idArtisan: e.idArtisan};

            axios
              .post('http://192.168.1.106:5000/getRatingUser', ob2)
              .then(response => {
                e.ratingUser = response.data[0].etoile;
                // console.log(response.data[0].etoile);
              });
          }, 1000);
        });
        this.setState({coordinates: response.data});
      });
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  componentWillMount() {
    this.getToken();
  }
  componentDidMount() {
    this.openGPS();

    axios
      .get('http://192.168.1.106:5000/services')
      .then(response => {
        this.setState({services: response.data});
      })
      .catch(er => console.log(err));
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
    let location = this.state.coordinates[index];

    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.09,
      longitudeDelta: 0.035,
    });

    this.state.markers[index].showCallout();
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
  onStarRatingPress(rating, idArt) {
    const ob = {
      etoile: rating,
      idArtisan: idArt,
      idClient: this.state.idUser,
    };
    console.log(ob);
    axios.post('http://192.168.1.106:5000/rating', ob).then(response => {
      //console.log(response.data);
    });
    this.setState({
      starCount: rating,
    });
  }
  sauvgarder(id) {
    const ob = {
      idClient: this.state.idUser,
      idArtisan: id,
    };
    axios
      .post('http://192.168.1.106:5000/verSave', ob)
      .then(response => {
        if (response.data.success) {
          alert('Déjà enregistrer');
        } else {
          axios
            .post('http://192.168.1.106:5000/addSave', ob)
            .then(response => {
              alert(response.data.message);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }
  renderCarouselItem = ({item}) => (
    <View style={styles.cardContainer}>
      <Grid>
        <Col style={styles.call}>
          <TouchableOpacity
            style={styles.bcall}
            icon="phone"
            onPress={() => {
              this.dialCall(item.phone);
            }}>
            <Icon name={'phone-square'} size={50} color="#FFFFFF" />
          </TouchableOpacity>
        </Col>
        <Col>
          <View style={{marginTop: 5, marginLeft: 10}}>
            <Grid>
              <Row>
                <Col style={{width: '80%'}}>
                  <Text style={styles.cardService}>{item.label}</Text>
                </Col>
                <Col>
                  <Text>
                    {item.rating} <Icon name="star" />
                  </Text>
                </Col>
              </Row>
            </Grid>
          </View>
          <View style={{paddingTop: 25}}>
            <Divider
              style={{backgroundColor: '#ffffff', width: 120, marginLeft: 10}}
            />
          </View>

          <View style={{paddingTop: 12, marginLeft: '15%'}}>
            <Text style={styles.cardNom}>
              {item.nom} {item.prenom}
            </Text>
          </View>

          <View style={styles.cardEtoile}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={item.ratingUser}
              selectedStar={rating =>
                this.onStarRatingPress(rating, item.idArtisan)
              }
            />
          </View>
          <View style={styles.cardSave}>
            <Button
              icon="bookmark"
              mode="outlined"
              onPress={() => this.sauvgarder(item.idArtisan)}>
              Sauvgarder
            </Button>
          </View>
        </Col>
      </Grid>
    </View>
  );
  onValueChange(value) {
    this.setState({
      search: value,
    });
    if (value == '0') {
      axios
        .get('http://192.168.1.106:5000/artisans')
        .then(response => {
          this.setState({coordinates: response.data});
        })
        .catch(er => console.log(err));
    } else {
      const ob = {
        id: value,
      };
      axios
        .post('http://192.168.1.106:5000/artisansByService', ob)
        .then(response => {
          this.setState({coordinates: response.data});
        })
        .catch(err => console.log(err));
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
                <Picker.Item label={e.label} value={e.idService} />
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
              key={marker.nom}
              ref={ref => (this.state.markers[index] = ref)}
              onPress={() => this.onMarkerPressed(marker, index)}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}>
              <Callout>
                <Text>
                  {marker.nom} {marker.prenom}
                </Text>
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
          itemWidth={300}
          removeClippedSubviews={false}
          onSnapToItem={index => this.onCarouselItemChange(index)}
        />
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  bcall: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  call: {
    width: '20%',
    backgroundColor: '#3B5998',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  cardContainer: {
    backgroundColor: 'rgba(0, 0, 0, .32)',
    height: 200,
    width: 300,
    borderRadius: 24,
  },
  cardService: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  cardNom: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  cardEtoile: {
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    padding: 8,
  },
  cardSave: {
    fontSize: 22,
    padding: 10,
  },
  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginLeft: 20,
    margin: 20,
  },
  picker: {margin: 8, marginLeft: 10},
  icon: {marginLeft: 14},
  container: {flex: 1},
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
