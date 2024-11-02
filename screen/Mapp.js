import React, { useEffect, useState } from 'react';
import { StyleSheet, View, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const Mapp = () => {
  const [region, setRegion] = useState({
    latitude: 10.97190,
    longitude: 106.67210,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission denied');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setRegion({
            ...region,
            latitude,
            longitude,
          });
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location" />
        )}
        <Marker coordinate={{ latitude: 10.97190, longitude: 106.67210 }} title="BarBer DTH" />
        <UrlTile
          urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Mapp;