import React, {Component, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Polygon,
  Circle,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Carousel from 'react-native-snap-carousel';

export default class Map extends Component {
  state = {
    markers: [],
    lat: '',
    long: '',
    coordinates: [
      {
        name: 'Plambier',
        latitude: 30.3025259,
        longitude: -9.4851431,
      },
      {
        name: 'Sbagh',
        latitude: 30.3023233,
        longitude: -9.4801411,
      },
      {
        name: 'Snack',
        latitude: 30.3225259,
        longitude: -9.4851431,
      },
      {
        name: 'Plambier2',
        latitude: 30.3225259,
        longitude: -9.4751431,
      },
      {
        name: 'Curry',
        latitude: 30.3125259,
        longitude: -9.5051431,
      },
    ],
  };
  componentDidMount() {
    this.requestLocationPermission();
  }
  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log('iPhone: ' + response);

      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    } else {
      var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      console.log('Android: ' + response);

      if (response === 'granted') {
        this.locateCurrentPosition();
      }
    }
  };

  locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(JSON.stringify(position));
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
      error => {
        alert('Open your position');
      },
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

  renderCarouselItem = ({item}) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{item.name}</Text>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <Text>
          {this.state.lat} __ {this.state.lang}
        </Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={map => (this._map = map)}
          showsUserLocation={true}
          style={styles.map}
          initialRegion={this.state.initialPosition}>
          {this.state.coordinates.map((marker, index) => (
            <Marker
              key={marker.name}
              ref={ref => (this.state.markers[index] = ref)}
              onPress={() => this.onMarkerPressed(marker, index)}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}>
              <Callout>
                <Text>{marker.name}</Text>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 30,
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 2,
  },
  cardContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 200,
    width: 300,
    padding: 24,
    borderRadius: 24,
  },
  cardImage: {
    height: 120,
    width: 300,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    alignSelf: 'center',
  },
});
