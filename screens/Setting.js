import * as React from 'react';
import {View, StyleSheet, ScrollView, AsyncStorage} from 'react-native';
import {
  Appbar,
  DefaultTheme,
  Provider as PaperProvider,
  configureFonts,
  Button,
  Text,
  DataTable,
} from 'react-native-paper';
import AddService from './AddService';
import {createStackNavigator} from '@react-navigation/stack';
import SelectPosition from './selectPosition';
import {AuthContext} from './context';
import axios from 'axios';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

const server = 'https://backend.herayfi.com/';
const server2 = 'http://upload.herayfi.com/';
const Stack = createStackNavigator();

export default function Setting() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={Content} />
      <Stack.Screen name="AddService" component={AddService} />
      <Stack.Screen name="SelectPosition" component={SelectPosition} />
    </Stack.Navigator>
  );
}

class Content extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      user: [],
    };
  }
  async getToken() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const idUser = JSON.parse(userData);

      const ob = {
        id: idUser,
      };
      axios
        .post(server + 'getUser', ob)
        .then(response => {
          this.setState({user: response.data});
          console.log(response.data);
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  componentDidMount() {
    this.getToken();
  }
  async removeToken(user) {
    try {
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  signOutG = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({user: null}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
  logOut = () => {
    const {signOut} = this.context;
    this.removeToken();
    signOut();
    this.signOutG();
  };
  render() {
    const {signOut} = this.context;

    return (
      <AuthContext.Provider value={signOut}>
        <PaperProvider theme={theme}>
          <Appbar.Header>
            <Appbar.Action
              icon="settings"
              onPress={() => console.log('Pressed archive')}
            />
            <Appbar.Content title="Options" />
            <Appbar.Action icon="dots-vertical" />
          </Appbar.Header>
          <ScrollView>
            <View>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Account</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  {this.state.user.map(e => (
                    <Button color="#3B5998" onPress={this.logOut}>
                      Se déconnecter {e.prenom} {e.nom}
                    </Button>
                  ))}
                </DataTable.Row>
              </DataTable>
              {this.state.user.map(e => (
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Votre informations</DataTable.Title>
                  </DataTable.Header>

                  <DataTable.Row>
                    <DataTable.Title>Nom et Prenom</DataTable.Title>
                    <DataTable.Title numeric>
                      {e.prenom} {e.nom}
                    </DataTable.Title>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Title>Email</DataTable.Title>
                    <DataTable.Title numeric>{e.email}</DataTable.Title>
                  </DataTable.Row>
                </DataTable>
              ))}
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Vous avez un service ?</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  <Button
                    color="#3B5998"
                    onPress={() =>
                      this.props.navigation.navigate('AddService')
                    }>
                    Ajouter votre service
                  </Button>
                </DataTable.Row>
              </DataTable>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Les langues</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                  <Button
                    color="#3B5998"
                    onPress={() => console.log('Pressed')}>
                    Anglais
                  </Button>
                </DataTable.Row>
                <DataTable.Row>
                  <Button
                    color="#3B5998"
                    onPress={() => console.log('Pressed')}>
                    Francais
                  </Button>
                </DataTable.Row>
                <DataTable.Row>
                  <Button
                    color="#3B5998"
                    onPress={() => console.log('Pressed')}>
                    Arabic
                  </Button>
                </DataTable.Row>
              </DataTable>
            </View>
          </ScrollView>
        </PaperProvider>
      </AuthContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 0,
  },
  vinput: {
    marginTop: 20,
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
    backgroundColor: '#f2f2f2',
    borderColor: '#ccc',
  },
  text: {
    color: '#000000',
    fontFamily: 'CoreSansAR-55Medium',
    fontSize: 15,
  },
  name: {
    textAlign: 'center',
    color: '#3B5998',
    fontFamily: 'segoescb',
    fontSize: 35,
    marginBottom: 20,
  },
});

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
