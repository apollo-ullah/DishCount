import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';
import discountData from '../assets/discountData';  // Changed from { discountData }

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
            >
                {selectedStore ? (
                    // Single marker for selected store
                    <Marker
                        coordinate={{
                            latitude: initialRegion.latitude,
                            longitude: initialRegion.longitude
                        }}
                        title={selectedStore}
                    />
                ) : (
                    // Show all markers when no store is selected
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
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
}); 