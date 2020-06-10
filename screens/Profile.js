import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  Platform,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import {
  Appbar,
  DefaultTheme,
  configureFonts,
  Provider as PaperProvider,
  Divider,
  Switch,
  Subheading,
} from 'react-native-paper';
import {Icon as Icon1} from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import axios from 'axios';
import {Rating, AirbnbRating} from 'react-native-ratings';

const server = 'https://backend.herayfi.com/';
const server2 = 'http://upload.herayfi.com/';
function Profile({route, navigation}) {
  const {id} = route.params;
  const {name} = route.params;
  const [user, setUser] = useState([]);
  const [client, setClient] = useState(0);
  const [nbr5, setNbr5] = useState(0);
  const [nbr4, setNbr4] = useState(0);
  const [nbr3, setNbr3] = useState(0);
  const [nbr2, setNbr2] = useState(0);
  const [reviews, setReviews] = useState(true);

  const [nbr1, setNbr1] = useState(0);

  useEffect(() => {
    setInterval(() => {
      const ob2 = {
        id: id,
      };
      axios.post(server + 'artProfile', ob2).then(response => {
        setUser(response.data[0]);
      });
    }, 1000);

    (async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const idUser = JSON.parse(userData);
        const ob2 = {
          idClient: idUser,
          idArtisan: id,
        };
        axios
          .post(server + 'verSave', ob2)
          .then(response => {
            //alert(response.data.message);
            if (response.data.success === true) {
              setIsSave(true);
            } else {
              setIsSave(false);
            }
          })
          .catch(err => console.log(err));
        setClient(idUser);
      } catch (error) {
        console.log('Something went wrong', error);
      }
    })();
    const ob = {
      id: id,
    };
    axios.post(server + 'artProfile', ob).then(response => {
      setUser(response.data[0]);
    });

    axios.post(server + 'staRating', ob).then(res => {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].etoile == 5) {
          setNbr5(res.data[i].nbr);
        }
        if (res.data[i].etoile == 4) {
          setNbr4(res.data[i].nbr);
        }
        if (res.data[i].etoile == 3) {
          setNbr3(res.data[i].nbr);
        }
        if (res.data[i].etoile == 2) {
          setNbr2(res.data[i].nbr);
        }
        if (res.data[i].etoile == 1) {
          setNbr1(res.data[i].nbr);
        }
      }
    });
  }, []);
  const [isSave, setIsSave] = useState();
  const _onToggleSwitch = () => {
    setIsSave(!isSave);
    const ob = {
      idClient: client,
      idArtisan: id,
    };

    if (!isSave) {
      axios
        .post(server + 'verSave', ob)
        .then(response => {
          alert(response.data.message);

          if (response.data.success === false) {
            setIsSave(true);
            axios
              .post(server + 'addSave', ob)
              .then(response => {
                // alert(response.data.message);
              })
              .catch(err => console.log(err));
          } else {
            setIsSave(false);
          }
        })
        .catch(err => console.log(err));
    } else {
      axios
        .post(server + 'deleteSave', ob)
        .then(response => {
          alert(response.data.message);
        })
        .catch(err => console.log(err));
    }
  };
  const dialCall = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };
  const ratingCompleted = rating => {
    // alert('Rating is: ' + rating);
    (async () => {
      const userData = await AsyncStorage.getItem('userData');
      const idUser = JSON.parse(userData);

      const ob = {
        idClient: idUser,
        idArtisan: id,
        etoile: rating,
      };
      console.log(ob);
      axios
        .post(server + 'rating', ob)
        .then(response => {
          alert(response.data.message);
        })
        .catch(err => console.log(err));
    })();
  };
  const onStarRatingPress = (rating, idArt) => {
    const ob = {
      etoile: rating,
      idArtisan: idArt,
      idClient: this.state.idUser,
    };
    // console.log(ob);
    axios.post(server + 'rating', ob).then(response => {
      //console.log(response.data);
    });
    this.setState({
      starCount: rating,
    });
  };

  return (
    <PaperProvider theme={theme1}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('HomeScreen')} />
        <Appbar.Content
          title="Profile"
          subtitle={user.prenom + ' ' + user.nom}
        />
      </Appbar.Header>
      <ScrollView style={styles.scroll}>
        <View style={styles.headerContainer}>
          <ImageBackground
            style={styles.headerBackgroundImage}
            blurRadius={10}
            source={{
              uri: server2 + 'uploads/profile.png',
            }}>
            <View style={styles.headerColumn}>
              <Image
                style={styles.userImage}
                source={{
                  uri: server2 + user.profile,
                }}
              />
              <Text style={styles.userNameText}>
                {user.prenom} {user.nom}
              </Text>
              <View style={styles.userAddressRow}>
                <View style={styles.userCityRow}>
                  <Text style={styles.userCityText}>{user.label}</Text>
                </View>
              </View>
              <View style={styles.rantingImg}>
                <View>
                  <Text
                    style={{
                      color: '#D4AF37',
                      fontSize: 15,
                      fontFamily: 'TTRounds-Light',
                    }}>
                    Ranting:
                  </Text>
                </View>
                <View style={{marginLeft: 12}}>
                  <Text
                    style={{
                      color: '#D4AF37',
                      fontSize: 20,
                      fontFamily: 'TTRounds-Light',
                    }}>
                    {user.ranting}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: '#D4AF37',
                      fontSize: 15,
                      fontFamily: 'TTRounds-Light',
                    }}>
                    /5
                  </Text>
                </View>

                <View
                  style={{
                    marginLeft: 5,
                  }}>
                  <StarRating
                    disabled={false}
                    maxStars={1}
                    rating={1}
                    starSize={20}
                    fullStarColor={'#D4AF37'}
                  />
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <Divider />
        <View style={{paddingTop: 15}}>
          <TouchableOpacity onPress={() => dialCall(user.phone)}>
            <View style={[styles.container]}>
              <View style={styles.iconRow}>
                <Icon1
                  name="call"
                  underlayColor="transparent"
                  iconStyle={styles.telIcon}
                  onPress={() => dialCall(user.phone)}
                />
              </View>
              <View style={styles.telRow}>
                <View style={styles.telNumberColumn}>
                  <Text style={styles.telNumberText}>{user.phone}</Text>
                </View>
                <View style={styles.telNameColumn}>
                  <Text style={styles.telNameText}>Mobile</Text>
                </View>
              </View>
              <View style={styles.smsRow}>
                <Icon1
                  name="textsms"
                  underlayColor="transparent"
                  iconStyle={styles.smsIcon}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Divider />
        <View style={{paddingTop: 15}}>
          <TouchableOpacity>
            <View style={[styles.container]}>
              <View style={styles.iconRow}>
                <Icon1
                  name="bookmark"
                  underlayColor="transparent"
                  iconStyle={styles.telIcon}
                />
              </View>
              <View style={styles.telRow}>
                <View style={styles.telNumberColumn}>
                  <Text style={styles.telNumberText}>Sauvgarder </Text>
                </View>
                <View style={styles.telNameColumn}>
                  <Text style={styles.telNameText}>Votre Boite</Text>
                </View>
              </View>
              <View style={styles.switch}>
                <Switch
                  value={isSave}
                  onValueChange={_onToggleSwitch}
                  color={'#3B5998'}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Divider />
        <View style={{paddingTop: 20, marginLeft: '10%'}}>
          <Subheading>Ajouter votre evaluation pour {user.nom} </Subheading>
        </View>
        <View style={{paddingTop: 22}}>
          <Rating
            onFinishRating={ratingCompleted}
            style={{paddingVertical: 10}}
            showRating={false}
            startingValue={0}
            fractions={2}
            imageSize={50}
          />
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

export default Profile;

const mainColor = '#3B5998';

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },

  headerBackgroundImage: {
    paddingBottom: 10,
    paddingTop: 20,
  },
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rantingImg: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'CoreSansAR-55Medium',
  },
  userImage: {
    borderColor: mainColor,
    borderRadius: 85,
    borderWidth: 2,
    height: 100,
    marginBottom: 12,
    width: 100,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 13,
  },
  iconRow: {
    flex: 2,
    justifyContent: 'center',
  },
  switch: {
    marginRight: 15,
  },
  smsIcon: {
    color: 'gray',
    fontSize: 30,
  },
  smsRow: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  telIcon: {
    color: mainColor,
    fontSize: 30,
  },
  telNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  telNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  telNumberColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  telNumberText: {
    fontSize: 16,
  },
  telRow: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'center',
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
const theme1 = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B5998',
    accent: 'yellow',
  },
};
