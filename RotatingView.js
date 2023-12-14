import React, { useEffect, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const RotatingView = () => {
    const [rotation, setRotation] = useState(new Animated.Value(0));

    useEffect(() => {
        const watchId = Geolocation.watchPosition(
            (position) => {
                const { heading } = position.coords;
                animateRotation(heading);
            },
            (error) => {
                console.log('Error getting location:', error);
            },
            {
                enableHighAccuracy: true,
                distanceFilter: 10,
            }
        );

        return () => {
            Geolocation.clearWatch(watchId);
        };
    }, []);

    const animateRotation = (heading) => {
        Animated.spring(rotation, {
            toValue: heading,
            useNativeDriver: true,
        }).start();
    };

    const rotateStyle = {
        transform: [{ rotate: rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) }],
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.rotatingView, rotateStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rotatingView: {
        width: 50,
        height: 50,
        backgroundColor: 'blue',
    },
});

export default RotatingView;
