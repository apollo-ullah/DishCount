import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import discountData from '../assets/discountData';

export default function MapScreen({ route, navigation }) {
    const mapRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const { initialRegion, selectedStore } = route?.params || {};

    const defaultRegion = {
        latitude: 45.5017,
        longitude: -73.5673,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                setUserLocation(location.coords);

                // Only center on user location if no store is selected
                if (!selectedStore && mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            }
        })();
    }, []);

    // Handle centering on selected store
    useEffect(() => {
        if (selectedStore && initialRegion && mapRef.current) {
            mapRef.current.animateToRegion({
                ...initialRegion,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000); // 1000ms animation duration
        }
    }, [selectedStore, initialRegion]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion || defaultRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {selectedStore ? (
                    // Show only the selected store marker
                    <Marker
                        coordinate={{
                            latitude: initialRegion.latitude,
                            longitude: initialRegion.longitude
                        }}
                        title={selectedStore}
                    />
                ) : (
                    // Show all store markers
                    discountData.map((location, index) => {
                        if (location.Coordinates && location.Coordinates.trim() && !location.isCityWide) {
                            const [lat, lon] = location.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                            return (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: lat,
                                        longitude: lon
                                    }}
                                    title={location.Store}
                                    description={`${location.Discount} - ${location.Category}`}
                                />
                            );
                        }
                        return null;
                    })
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
}); 