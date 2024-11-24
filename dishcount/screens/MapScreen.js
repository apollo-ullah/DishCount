import React, { useEffect, useState } from 'react';
import MapView from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import discountData from '../assets/discountData';

export default function MapScreen({ route, navigation }) {
    const defaultRegion = {
        latitude: 45.5017,
        longitude: -73.5673,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const { initialRegion = defaultRegion, selectedStore = null } = route?.params || {};

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
            >
                {selectedStore ? (
                    <Marker
                        coordinate={{
                            latitude: initialRegion.latitude,
                            longitude: initialRegion.longitude
                        }}
                        title={selectedStore}
                    />
                ) : (
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