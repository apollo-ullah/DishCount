import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import discountData from '../assets/discountData';
import { GOOGLE_MAPS_API_KEY } from '@env';

export default function MapScreen({ route, navigation }) {
    const initialRegion = route.params?.initialRegion;
    const selectedStore = route.params?.selectedStore;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion || {
                    latitude: 45.50704158354374,
                    longitude: -73.57860280160313,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                provider={PROVIDER_GOOGLE}
                apiKey={GOOGLE_MAPS_API_KEY}
            >
                {discountData.map((discount, index) => {
                    const [lat, lon] = discount.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                    return (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: lat,
                                longitude: lon
                            }}
                            title={discount.Store}
                            description={`${discount.Discount} with ${discount.Form}`}
                            pinColor={discount.Store === selectedStore ? '#ff6347' : '#FF0000'}
                        />
                    );
                })}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    }
}); 