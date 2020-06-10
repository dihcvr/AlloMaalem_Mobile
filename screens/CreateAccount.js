import React from 'react';
import {View, StyleSheet, AsyncStorage, ScrollView, Image} from 'react-native';
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
import {AuthContext} from './context';
import axios from 'axios';
const server = 'https://backend.herayfi.com/';
const ScreenContainer = ({children}) => (
  <View style={styles.container}>{children}</View>
);

export default class CreateAccount extends React.Component {
  state = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    passwordConfirm: '',
    msg: '',
    visible: false,
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

  CreateAccount = () => {
    const {signIn} = this.context;
    if (
      this.state.nom === '' ||
      this.state.prenom === '' ||
      this.state.email === ''
    ) {
      this.setState({
        msg: ' Tous les champs sont obligatoires ',
      });
      this._onToggleSnackBar();
    } else if (this.state.password != this.state.passwordConfirm) {
      this.setState({
        msg: 'Les mots de pase ne correspondent pas. Veuillez réssayer.',
      });
      this._onToggleSnackBar();
    } else {
      const ob = {
        nom: this.state.nom,
        prenom: this.state.prenom,
        email: this.state.email,
        password: this.state.password,
      };
      axios
        .post(server + 'createAccount', ob)

        .then(res => {
          if (res.data.success === true) {
            axios.post(server + 'getUser', {id: res.data.userId}).then(res => {
              console.log(res.data[0].idClient);
              this.storeToken(JSON.stringify(res.data[0].idClient));

              signIn();
              alert('Bienvenue sur Allo Maalem');
            });
          } else {
            this.setState({msg: res.data.message});
            alert(res.data.message);
          }
        });
    }
  };

  static contextType = AuthContext;
  render() {
    const {visible} = this.state;
    const {signIn} = this.context;
    return (
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <AuthContext.Provider value={signIn}>
            <ScrollView>
              <View style={{alignItems: 'center'}}>
                <Image style={{}} source={require('../img/00.png')} />
              </View>
              <View style={styles.snkr}>
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
                    placeholder="Nom"
                    onChangeText={e => {
                      this.setState({nom: e});
                    }}
                  />
                  <Icon active name="person" style={styles.icon} />
                </Item>
              </View>
              <View style={styles.vinput}>
                <Item regular style={styles.item}>
                  <Input
                    style={styles.input}
                    placeholder="Prénom"
                    onChangeText={e => {
                      this.setState({prenom: e});
                    }}
                  />
                  <Icon active name="person" style={styles.icon} />
                </Item>
              </View>
              <View style={styles.vinput}>
                <Item regular style={styles.item}>
                  <Input
                    style={styles.input}
                    placeholder="Email Ou Telephone"
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
                    placeholder="Mot de passe"
                    secureTextEntry
                    onChangeText={e => {
                      this.setState({password: e});
                    }}
                  />
                  <Icon active name="key" style={styles.icon} />
                </Item>
              </View>
              <View style={styles.vinput}>
                <Item regular style={styles.item}>
                  <Input
                    style={styles.input}
                    placeholder="Confirmer le Mot de passe"
                    secureTextEntry
                    onChangeText={e => {
                      this.setState({passwordConfirm: e});
                    }}
                  />
                  <Icon active name="key" style={styles.icon} />
                </Item>
              </View>
              <View style={styles.vinput}>
                <Button mode="contained" onPress={this.CreateAccount}>
                  Créer le compte
                </Button>
              </View>

              <View style={{marginTop: 25}}>
                <Divider />
              </View>
            </ScrollView>
          </AuthContext.Provider>
        </View>
      </PaperProvider>
    );
  }
}
const styles = StyleSheet.create({
  snkr: {
    flex: 1,
    marginTop: 20,
  },
  container: {
    margin: 30,
    marginTop: 15,
  },
  vinput: {
    marginTop: 15,
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
    fontSize: 25,
    marginBottom: 20,
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
