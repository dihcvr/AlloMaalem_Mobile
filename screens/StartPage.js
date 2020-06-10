import * as React from 'react';
import {Image, View, StyleSheet, AsyncStorage} from 'react-native';
import {AuthContext} from './context';
import {Container, Header, Content, Input, Item, Icon} from 'native-base';
import {
  Searchbar,
  DefaultTheme,
  Provider as PaperProvider,
  TextInput,
  configureFonts,
  Button,
  Snackbar,
  Text,
  Divider,
} from 'react-native-paper';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import {Col, Row, Grid} from 'react-native-easy-grid';
import axios from 'axios';
const server = 'https://backend.herayfi.com/';
class FormScreen extends React.Component {
  state = {
    email: '',
    password: '',
    msg: '',
    idUser: null,
  };
  _onToggleSnackBar = () => this.setState(state => ({visible: !state.visible}));
  _onDismissSnackBar = () => this.setState({visible: false});
  async storeToken(user) {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  async getToken(user) {
    try {
      const {signIn} = this.context;
      const userData = await AsyncStorage.getItem('userData');
      const idUser = JSON.parse(userData);
      this.setState({
        idUser: idUser,
      });
      if (idUser != null) {
        signIn();
      }
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  componentDidMount() {
    this.getToken();
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '323191661031-arlkpl1r4qe76reucol5eb6r65ne1dad.apps.googleusercontent.com',
      //offlineAccess: true,
      // hostedDomain: '', // specifies a hosted domain restriction
      //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      //forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }

  signIn = async () => {
    const {signIn} = this.context;
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo});

      const ob = {
        nom: userInfo.user.familyName,
        prenom: userInfo.user.givenName,
        email: userInfo.user.email,
        password: '',
      };
      axios
        .post(server + 'createAccount2', ob)

        .then(res => {
          if (res.data.success === true) {
            axios.post(server + 'getUser', {id: res.data.userId}).then(res => {
              //console.log(res.data[0].idClient);

              this.storeToken(res.data[0].idClient);
              signIn();
              alert('Bienvenue sur Allo Maalem');
            });
          } else {
            this.setState({msg: res.data.message});
            alert(res.data.message);
          }
        });

      console.log(ob);
    } catch (error) {
      console.log(error.code);
      // alert(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('2');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('2');
      } else {
        // some other error happened
      }
    }
  };

  login = () => {
    const {signIn} = this.context;
    const {admin} = this.context;
    const ob = {
      email: this.state.email,
      password: this.state.password,
    };
    axios
      .post(server + 'auth', ob)

      .then(res => {
        if (res.data.success === true) {
          this.storeToken(res.data.user.idClient);
          if (res.data.user.isAdmin === 1) {
            admin();
          } else {
            signIn();
          }
        } else {
          this.setState({msg: res.data.message});
          this._onToggleSnackBar();
        }
      })
      .catch(er => console.log(er));
  };

  static contextType = AuthContext;

  render() {
    const {signIn} = this.context;
    const {visible} = this.state;
    return (
      <AuthContext.Provider value={signIn}>
        <View>
          <View style={{alignItems: 'center'}}>
            <Image source={require('../img/222.png')} />
          </View>
          <View style={{marginTop: 30}}>
            <Snackbar
              visible={visible}
              onDismiss={this._onDismissSnackBar}
              action={{
                label: 'OK',
                onPress: () => {
                  // Do something
                },
              }}>
              {this.state.msg}
            </Snackbar>
          </View>
          <View style={styles.vinput}>
            <Item regular style={styles.item}>
              <Input
                style={styles.input}
                placeholder="Email Or Phone"
                type="password"
                onChangeText={e => {
                  this.setState({email: e});
                }}
              />
              <Icon active name="mail" style={styles.icon} />
            </Item>
          </View>
          <View style={styles.vinput}>
            <Item regular style={styles.item}>
              <Input
                style={styles.input}
                placeholder="Password"
                type="password"
                secureTextEntry
                onChangeText={e => {
                  this.setState({password: e});
                }}
              />
              <Icon active name="key" style={styles.icon} />
            </Item>
          </View>
          <View style={styles.vinput}>
            <Button mode="contained" onPress={this.login}>
              Log In
            </Button>
          </View>
          <View style={{marginTop: 30}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
              <View>
                <Text
                  style={{
                    width: 50,
                    textAlign: 'center',

                    fontFamily: 'CoreSansAR-55Medium',
                  }}>
                  OR
                </Text>
              </View>
              <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
            </View>
          </View>
          <View style={styles.userAddressRow}>
            <GoogleSigninButton
              style={{width: '100%', height: 48}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this.signIn}
            />
            {/*<View style={{width: '47%'}}>
              <Button
                style={styles.media}
                icon="facebook"
                mode="contained"
                onPress={() => console.log('Pressed')}>
                Facebook
              </Button>
            </View>
            <View style={{width: '6%'}} />
            <View style={{width: '47%'}}>
              <Button
                style={styles.media}
                color="#B23121"
                icon="google"
                mode="contained"
                onPress={() => console.log('Pressed')}>
                Gmail
              </Button>
            </View>
         
                  */}
          </View>
          <View style={{marginTop: 20}}>
            <Divider />
          </View>
        </View>
      </AuthContext.Provider>
    );
  }
}

export default function StartPage({navigation}) {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <FormScreen />
        <View style={{marginTop: 6}}>
          <Button onPress={() => navigation.push('CreateAccount')}>
            <Text style={styles.text}>Dont have an account? </Text>Sign up
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  container: {
    margin: 30,
    marginTop: 50,
  },
  vinput: {
    marginTop: 15,
  },
  media: {
    borderRadius: 10,
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
    // backgroundColor: '#f2f2f2',
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF',
  },
  text: {
    textAlign: 'center',
    color: '#062429',
    fontFamily: 'CoreSansAR-55Medium',
    fontSize: 11,
  },
  name: {
    textAlign: 'center',
    color: '#3B5998',
    fontFamily: 'segoescb',
    fontSize: 40,
    marginBottom: 0,
  },
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B5998',
    accent: 'yellow',
  },
};
const theme1 = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#B23121',
    accent: 'yellow',
  },
};
