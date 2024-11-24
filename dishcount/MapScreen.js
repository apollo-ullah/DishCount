import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import discountData from './assets/discountData';

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Initial region (Montreal)
    const [region, setRegion] = useState({
        latitude: 45.5017,
        longitude: -73.5673,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const renderMarkers = () => {
        return discountData
            .filter(discount => selectedCategory === 'All' || discount.Category === selectedCategory)
            .map((discount, index) => {
                const [lat, lng] = discount.Coordinates.split(',').map(coord => parseFloat(coord.trim()));

                return (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: lat,
                            longitude: lng
                        }}
                        title={discount.Store}
                        description={discount.Discount}
                    />
                );
            });
    };

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={region}
                showsUserLocation={true}
            >
                {renderMarkers()}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});

export default MapScreen; 