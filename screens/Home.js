import * as React from 'react';
import {Icon as Icon2} from 'react-native-vector-icons/dist/FontAwesome';
import {
  View,
  Image,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import {
  Appbar,
  DefaultTheme,
  Provider as PaperProvider,
  configureFonts,
  Avatar,
  DataTable,
  Title,
  List,
  Text,
  Paragraph,
} from 'react-native-paper';

import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import axios from 'axios';

const server = 'https://backend.herayfi.com/';
const server2 = 'http://upload.herayfi.com/';
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idUser: '',
      saves: [],
    };
  }
  async getToken() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const idUser = JSON.parse(userData);

      this.setState({
        idUser: idUser,
      });
      const ob = {
        id: idUser,
      };
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }

  componentDidMount() {
    this.getToken();
    axios.get(server + 'topArt').then(response => {
      this.setState({
        saves: response.data,
      });
    });
  }
  dialCall = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  render() {
    return (
      <PaperProvider theme={theme}>
        <Appbar.Header>
          <Appbar.Action icon="phone" />
          <Appbar.Content title="Allo Maalem" />
          <Appbar.Action icon="dots-vertical" onPress={this._handleMore} />
        </Appbar.Header>

        <ScrollView>
          <View style={styles.card}>
            <Content>
              <Card>
                <View style={styles.userAddressRow}>
                  <Text
                    style={{
                      fontFamily: 'TTRounds-Black',
                      fontSize: 20,
                    }}>
                    Bienvenu à
                  </Text>

                  <Image style={{}} source={require('../img/00.png')} />
                </View>

                <CardItem cardBody>
                  <Image
                    source={{uri: server2 + 'uploads/affiche0.jpg'}}
                    style={{height: 200, width: null, flex: 1}}
                  />
                </CardItem>
                <CardItem>
                  <Paragraph
                    style={{
                      fontFamily: 'CoreSansAR-55Medium',
                      fontSize: 12,
                    }}>
                    Allo Maalem, est une plateforme intermidiare entre les
                    artisans (plombiers, électriciens, peintres… etc.) et des
                    clients potentiels. Allo Maalem facilite de trouver des
                    artisans rapidement dans votre quartiers d'une maniere
                    simple
                  </Paragraph>
                </CardItem>
              </Card>
              <Card>
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      padding: 10,
                      fontFamily: 'TTRounds-Black',
                      fontSize: 17,
                    }}>
                    Top Profiles Maalem
                  </Text>
                </View>

                <PaperProvider theme={themeT}>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title>Informations</DataTable.Title>

                      <DataTable.Title numeric>Appel</DataTable.Title>
                    </DataTable.Header>
                    {this.state.saves.map(e => (
                      <List.Item
                        title={e.nom + ' ' + e.prenom}
                        description={props => (
                          <View
                            style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                fontFamily: 'CoreSansAR-55Medium',

                                fontSize: 12,
                              }}>
                              {e.label}
                              {'   '}
                            </Text>
                            <Text
                              style={{
                                fontFamily: 'CoreSansAR-55Medium',
                                color: '#D4AF37',
                                fontSize: 12,
                              }}>
                              {e.ranting}
                            </Text>
                            <Icon
                              name="star"
                              style={{fontSize: 15, color: '#D4AF37'}}
                              underlayColor="transparent"
                            />
                          </View>
                        )}
                        left={props => (
                          <Image
                            style={{
                              borderRadius: 50,
                              height: 40,
                              width: 40,
                            }}
                            source={{uri: server2 + e.profile}}
                          />
                        )}
                        right={props => (
                          <View>
                            <Icon
                              style={{
                                marginRight: 12,
                                marginTop: 9,
                                color: '#3B5998',
                              }}
                              name="call"
                              underlayColor="transparent"
                              iconStyle={styles.telIcon}
                              onPress={() => this.dialCall(e.phone)}
                            />
                          </View>
                        )}
                      />
                    ))}

                    <DataTable.Pagination
                      page={1}
                      numberOfPages={3}
                      onPageChange={page => {
                        console.log(page);
                      }}
                      label="1-2 of 6"
                    />
                  </DataTable>
                </PaperProvider>
              </Card>
              <Card>
                <View>
                  <CardItem>
                    <Text style={styles.tMedia}>
                      Pour visiter notre social média
                    </Text>
                  </CardItem>

                  <CardItem>
                    <Icon
                      active
                      name="logo-facebook"
                      style={{color: '#3B5998'}}
                    />
                    <Text style={styles.txtMedia}>Facebook</Text>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Icon
                      active
                      name="logo-instagram"
                      style={{color: '#C13584'}}
                    />
                    <Text style={styles.txtMedia}>Instagram</Text>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Icon active name="logo-google" style={{color: 'red'}} />
                    <Text style={styles.txtMedia}>Gmail</Text>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Icon
                      active
                      name="logo-twitter"
                      style={{color: '#1DA1F2'}}
                    />
                    <Text style={styles.txtMedia}>Twitter</Text>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
                  </CardItem>
                </View>
              </Card>
            </Content>
          </View>
        </ScrollView>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
  },
  tMedia: {
    fontFamily: 'CoreSansAR-55Medium',
    marginLeft: 30,
    fontSize: 12,
    color: '#3B5998',
  },
  txtMedia: {
    fontFamily: 'CoreSansAR-55Medium',
    marginLeft: 30,
    fontSize: 12,
  },
  card: {
    margin: 10,
    marginBottom: 400,
  },
  paragraph: {
    textAlign: 'justify',
  },
});

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'TTRounds-Black',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'TTRounds-Black',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'TTRounds-Black',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'TTRounds-Black',
      fontWeight: 'normal',
    },
  },
};
const fontConfig2 = {
  default: {
    regular: {
      fontFamily: 'TTRounds-Black',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'TTRounds-Black',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'TTRounds-Black',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'TTRounds-Black',
      fontWeight: 'normal',
    },
  },
};
const themeT = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: '#3B5998',
    accent: 'yellow',
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

const theme2 = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: '#3B5998',
    accent: 'yellow',
  },
};
