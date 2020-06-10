import * as React from 'react';

import {
  Appbar,
  DefaultTheme,
  Provider as PaperProvider,
  configureFonts,
  Subheading,
} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
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
import {Button} from 'react-native-paper';

import axios from 'axios';
//import Icon from 'react-native-vector-icons/dist/FontAwesome';
import StarRating from 'react-native-star-rating';
const server = 'https://backend.herayfi.com/';
const server2 = 'http://upload.herayfi.com/';
export default class Save extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idUser: '',
      saves: [],
      msg: 'ddd',
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
      setInterval(() => {
        axios
          .post(server + 'saves', ob)
          .then(response => {
            this.setState({saves: response.data, msg: null});
          })
          .catch(err => {
            console.log(err);
            this.setState({msg: 'djfjf'});
          });
      }, 1000);
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }

  componentDidMount() {
    this.getToken();
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
          <Appbar.Action icon="bookmark" />
          <Appbar.Content title="Artisans Sauvgardés" />
        </Appbar.Header>
        <Container>
          <Content>
            {this.state.msg != null ? (
              <Subheading style={{color: '#606060'}}>
                Aucun artisans sauvgardé
              </Subheading>
            ) : (
              <Text />
            )}
            {this.state.saves.map(e => (
              <List>
                <ListItem avatar>
                  <Left>
                    <Thumbnail source={{uri: server2 + e.profile}} />
                  </Left>
                  <Body>
                    <View>
                      <Text
                        style={{
                          fontFamily: 'TTRounds-Bold',
                        }}>
                        {e.prenom} {e.nom}
                      </Text>
                    </View>

                    <View style={styles.userAddressRow}>
                      <View>
                        <Text note>{e.label}</Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: '#D4AF37',
                            fontFamily: 'TTRounds-Bold',
                            fontSize: 15,
                          }}>
                          {e.rating}
                        </Text>
                      </View>

                      <View>
                        <StarRating
                          disabled={false}
                          maxStars={1}
                          rating={1}
                          starSize={16}
                          fullStarColor={'#D4AF37'}
                        />
                      </View>
                    </View>
                  </Body>
                  <Right>
                    <View style={styles.iconRow}>
                      <Icon
                        name="call"
                        underlayColor="transparent"
                        iconStyle={styles.telIcon}
                        onPress={() => this.dialCall(e.phone)}
                      />
                    </View>
                  </Right>
                </ListItem>
              </List>
            ))}
          </Content>
        </Container>
      </PaperProvider>
    );
  }
}
const styles = StyleSheet.create({
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  telIcon: {
    color: '#01C89E',
    fontSize: 30,
  },
});
const fontConfig = {
  default: {
    regular: {
      fontFamily: 'TTRounds-Bold',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'TTRounds-Bold',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'TTRounds-Bold',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'TTRounds-Bold',
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
