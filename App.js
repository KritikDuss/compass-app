import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';


export default function App() {
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [locationData, setLocationData] = useState({ coords: { heading: 0 } });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status === 'granted') {
    //   console.log('Location permission granted');
    // } else {
    //   console.log('Location permission denied');
    // }
    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission not granted');
      return;
    }

  };

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const result = await Location.getHeadingAsync();
        setLocationData(result);
      } catch (error) {
        console.error('Error getting heading:', error);
      }
    };

    // Call the function to get the heading when the component mounts
    fetchHeading();
    // Subscribe to Magnetometer data
    const magnetometerSubscription = Magnetometer.addListener((result) => {
      setMagnetometerData(result);
    });

    // Subscribe to Location data
    const locationSubscription = Location.watchHeadingAsync((result) => {
      setLocationData(result);
    });

    // Unsubscribe from subscriptions on component unmount
    return () => {
      magnetometerSubscription.remove();
      // locationSubscription.remove();
    };
  }, []);

  const getMagneticHeading = () => {
    const angle = Math.atan2(magnetometerData.y, magnetometerData.x);
    const degree = angle * (180 / Math.PI);
    return degree >= 0 ? degree : 360 + degree;
  };

  const getTrueHeading = () => {
    // Check if locationData is defined and has the coords object
    if (locationData && locationData.coords) {
      return locationData.coords.heading;
    }
    // Return a default value if locationData is not yet available
    return 0;
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>{`Magnetic Heading: ${getMagneticHeading().toFixed(2)}°`}</Text> */}
      {/* <Text style={styles.heading}>{`True Heading: ${getTrueHeading().toFixed(2)}°`}</Text> */}
      <View>
        <Text style={styles.heading}>True Heading: {locationData?.trueHeading || 'N/A'}</Text>
        {/* Add other UI components or use locationData in your UI */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 34,
  },
});
