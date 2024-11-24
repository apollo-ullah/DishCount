import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';

export default function LocationTest() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            console.log('Requesting permissions...');
            let { status } = await Location.requestForegroundPermissionsAsync();
            console.log('Permission status:', status);

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            console.log('Getting location...');
            let location = await Location.getCurrentPositionAsync({});
            console.log('Location:', location);
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{text}</Text>
        </View>
    );
} 