import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import {Input, Item, Root, ActionSheet, Picker, Form} from 'native-base';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {
  Searchbar,
  DefaultTheme,
  Provider as PaperProvider,
  TextInput,
  configureFonts,
  Button,
  Text,
  Card,
  Checkbox,
  ActivityIndicator,
  Colors,
  Banner,
  Appbar,
} from 'react-native-paper';
import {Col, Row, Grid} from 'react-native-easy-grid';

import {BackHandler, DeviceEventEmitter} from 'react-native';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
//import uploadFile from '../api/upload.js';
import pickRecto from '../api/picker.js';
import RNFetchBlob from 'react-native-fetch-blob';
const server2 = 'https://upload.herayfi.com/';
const server = 'https://backend.herayfi.com/';

export default class AddService extends React.Component {
  state = {
    nom: null,
    prenom: null,
    phone: null,
    latitude: null,
    longitude: null,
    adresse: null,
    checked: false,
    cnRecto: null,
    cnRectoSource: null,
    cnVerso: null,
    profileSource: null,
    profile: null,
    cnVersoSource: null,
    services: [],
    idService: null,
    progress: false,
    visible: true,
    user: [],
  };

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
    });
  };
  async getToken(user) {
    try {
      let userData = await AsyncStorage.getItem('userData');
      const data = JSON.parse(userData);

      this.setState({
        user: data,
      });
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  componentDidMount() {
    setInterval(() => {
      const {route} = this.props;
      const params = route.params;
      if (params) {
        this.setState({
          latitude: params.lat,
          longitude: params.lang,
        });
      } else {
        this.requestLocationPermission();
      }
    }, 1000);
    this.getToken();
    this.openGPS();

    axios
      .get(server + 'services')
      .then(response => {
        this.setState({services: response.data});
      })
      .catch(er => console.log(err));
  }

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      //console.log('iPhone: ' + response);

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
        //alert(JSON.stringify(position));
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {},
    );
  };
  goSelectRecto = () => {
    pickRecto((source, data) =>
      this.setState({cnRectoSource: source, cnRecto: data}),
    );
  };

  goSelectVerso = () => {
    pickRecto((source, data) =>
      this.setState({cnVersoSource: source, cnVerso: data}),
    );
  };
  goSelectProfile = () => {
    pickRecto((source, data) =>
      this.setState({profileSource: source, profile: data}),
    );
  };
  sendYourRequest = () => {
    const {
      nom,
      prenom,
      phone,
      latitude,
      longitude,
      cnRecto,
      cnVerso,
      profile,
      idService,
    } = this.state;
    if (
      nom === null ||
      prenom === null ||
      phone === null ||
      cnRecto === null ||
      cnVerso === null ||
      profile === null
    ) {
      alert('Les information incomplètes');
    } else if (latitude === null || longitude === null) {
      this.openGPS();
    } else {
      RNFetchBlob.fetch(
        'POST',
        server2 + 'upload',
        {
          Authorization: 'Bearer access-token',
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data',
          'Dropbox-API-Arg': JSON.stringify({
            path: '/img-from-react-native.png',
            mode: 'add',
            autorename: true,
            mute: false,
          }),
        },
        [
          {
            name: 'value',
            data: JSON.stringify({
              nom: this.state.nom,
              prenom: this.state.prenom,
              phone: this.state.phone,
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              idService: this.state.idService,
            }),
          },

          {name: 'cnRecto', filename: 'cnRecto.png', data: this.state.cnRecto},
          {
            name: 'cnVerso',
            filename: 'cnVerso.png',
            data: this.state.cnVerso,
          },
          {
            name: 'profile',
            filename: 'profile.png',
            data: this.state.profile,
          },
        ],
      )
        .uploadProgress((written, total) => {
          console.log('uploaded', written / total);
          this.setState({progress: true});
        })

        .then(res => {
          this.setState({
            progress: false,
            nom: '',
            prenom: '',
            phone: '',
            idService: '',
            cnRecto: null,
            cnVerso: null,
            cnRectoSource: null,
            cnVersoSource: null,
            profile: null,
            profileSource: null,
          });
          alert('Votre demande est en cours de traitement !');
          //alert(res.data.message);
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <View>
        <ScrollView>
          <PaperProvider theme={theme}>
            <Appbar.Header>
              <Appbar.BackAction
                onPress={() => this.props.navigation.navigate('Home')}
              />
              <Appbar.Content title="Ajouter votre service" />
            </Appbar.Header>
          </PaperProvider>
          <Root>
            <View style={styles.container}>
              <View>
                <Banner
                  visible={this.state.visible}
                  actions={[
                    {
                      label: 'OK',
                      onPress: () => this.setState({visible: false}),
                    },
                    {
                      label: 'Autre position',
                      onPress: () =>
                        this.props.navigation.navigate('SelectPosition'),
                    },
                  ]}
                  icon={({size}) => <Icon name="map-marker-alt" size={20} />}>
                  Garder votre adresse dans la position actuelle ou selectionner
                  un autre position
                </Banner>
              </View>
              <View />
              <View style={styles.vinput}>
                <Grid>
                  <Col>
                    <Item regular style={[styles.item]}>
                      <Input
                        style={styles.input}
                        placeholder="Nom"
                        value={this.state.nom}
                        onChangeText={e => {
                          this.setState({nom: e});
                        }}
                      />
                    </Item>
                  </Col>
                  <Col>
                    <Item regular style={styles.item}>
                      <Input
                        style={styles.input}
                        placeholder="prenom"
                        value={this.state.prenom}
                        onChangeText={e => {
                          this.setState({prenom: e});
                        }}
                      />
                    </Item>
                  </Col>
                </Grid>
              </View>
              <View style={styles.vinput}>
                <Item regular style={styles.item}>
                  <Input
                    style={styles.input}
                    placeholder="Telephone"
                    value={this.state.phone}
                    onChangeText={e => {
                      this.setState({phone: e});
                    }}
                  />
                  <Icon active name="phone" style={styles.icon} />
                </Item>
              </View>
              <View style={styles.vinput}>
                <Item picker style={styles.item}>
                  <Picker
                    mode="dropdown"
                    selectedValue={this.state.idService}
                    onValueChange={e => {
                      this.setState({idService: e});
                    }}>
                    <Picker.Item
                      label="select your service"
                      value=""
                      color="#c1c1c1"
                    />
                    {this.state.services.map(e => (
                      <Picker.Item label={e.label} value={e.idService} />
                    ))}
                  </Picker>
                  <Icon active name="search" style={styles.icon} />
                </Item>
              </View>
              <View style={styles.vinput}>
                <Card>
                  <Card.Title
                    title="Carte National - Recto"
                    titleStyle={{
                      fontFamily: 'CoreSansAR-55Medium',
                      fontSize: 17,
                    }}
                    right={props => (
                      <Button
                        icon="plus"
                        theme={theme}
                        style={{marginRight: 10}}
                        mode="contained"
                        onPress={() => this.goSelectRecto()}>
                        Ajouter
                      </Button>
                    )}
                  />
                  {this.state.cnRectoSource == null ? null : (
                    <Card.Cover source={this.state.cnRectoSource} />
                  )}
                </Card>
              </View>
              <View style={styles.vinput}>
                <Card>
                  <Card.Title
                    title="Carte National - Verso"
                    titleStyle={{
                      fontFamily: 'CoreSansAR-55Medium',
                      fontSize: 17,
                    }}
                    right={props => (
                      <Button
                        icon="plus"
                        theme={theme}
                        style={{marginRight: 10}}
                        mode="contained"
                        onPress={() => this.goSelectVerso()}>
                        Ajouter
                      </Button>
                    )}
                  />
                  {this.state.cnVersoSource == null ? null : (
                    <Card.Cover source={this.state.cnVersoSource} />
                  )}
                </Card>
              </View>
              <View style={styles.vinput}>
                <Card>
                  <Card.Title
                    title="Photo de profile"
                    titleStyle={{
                      fontFamily: 'CoreSansAR-55Medium',
                      fontSize: 17,
                    }}
                    right={props => (
                      <Button
                        icon="plus"
                        theme={theme}
                        style={{marginRight: 10}}
                        mode="contained"
                        onPress={() => this.goSelectProfile()}>
                        Ajouter
                      </Button>
                    )}
                  />
                  {this.state.profileSource == null ? null : (
                    <Card.Cover source={this.state.profileSource} />
                  )}
                </Card>
              </View>
              <View style={styles.vinput}>
                <Button
                  theme={theme}
                  mode="contained"
                  onPress={() => this.sendYourRequest()}>
                  Valider
                </Button>
              </View>
            </View>
          </Root>
        </ScrollView>
        {this.state.progress ? (
          <Modal transparent={true}>
            <View style={styles.indicator}>
              <ActivityIndicator
                animating={true}
                color={Colors.red800}
                size={140}
              />
            </View>
          </Modal>
        ) : (
          <Text />
        )}
      </View>
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
    accent: '#3B5998',
  },
};
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

  container: {
    marginBottom: 300,
    margin: 10,
  },
  vinput: {
    marginTop: 10,
  },
  icon: {
    marginRight: 8,
    color: '#bbbbbb',
  },
  input: {
    fontFamily: 'CoreSansAR-55Medium',
    fontSize: 14,
    borderRadius: 39,
    marginLeft: 7,
  },
  item: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
  },
  text: {
    textAlign: 'center',
    color: '#b9babd',
    fontFamily: 'CoreSansAR-55Medium',
    fontSize: 11,
  },
  name: {
    textAlign: 'center',
    color: '#3B5998',
    fontFamily: 'segoescb',
    fontSize: 35,
    marginBottom: 20,
  },
});
