import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import discountData from '../assets/discountData';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Explore');
    const [favorites, setFavorites] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [locationsWithDistance, setLocationsWithDistance] = useState([]);
    const [notifiedStores, setNotifiedStores] = useState(new Set());

    const toggleFavorite = (store) => {
        setFavorites(prev =>
            prev.includes(store)
                ? prev.filter(s => s !== store)
                : [...prev, store]
        );
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                setUserLocation(location);
                calculateDistances(location);

                // Set up location watching
                const subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 5, // Check every 10 meters
                        timeInterval: 5000    // Check every 5 seconds
                    },
                    (newLocation) => {
                        setUserLocation(newLocation);
                        calculateDistances(newLocation);
                        checkForNearbyDiscounts(newLocation);
                    }
                );

                return () => {
                    if (subscription) {
                        subscription.remove();
                    }
                };
            }
        })();
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const calculateDistances = (userLoc) => {
        const locationsWithDist = discountData.map(location => {
            if (location.isCityWide) {
                return { ...location };
            }

            if (location.Coordinates && location.Coordinates.trim()) {
                const [lat, lon] = location.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                const distance = calculateDistance(
                    userLoc.coords.latitude,
                    userLoc.coords.longitude,
                    lat,
                    lon
                );
                return { ...location, distance };
            }
            return { ...location };
        });
        setLocationsWithDistance(locationsWithDist);
    };

    const checkForNearbyDiscounts = async (userLoc) => {
        console.log("Checking for nearby discounts..."); // Debug log

        const nearbyDiscounts = discountData.filter(store => {
            if (store.Coordinates && !store.isCityWide) {
                const [lat, lon] = store.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                const distance = calculateDistance(
                    userLoc.coords.latitude,
                    userLoc.coords.longitude,
                    lat,
                    lon
                );
                console.log(`Distance to ${store.Store}: ${distance} km`); // Debug log
                return distance <= 1.0 && !notifiedStores.has(store.Store); // Only return stores we haven't notified about
            }
            return false;
        });

        if (nearbyDiscounts.length > 0) {
            try {
                const savedNotifications = await AsyncStorage.getItem('@notifications') || '[]';
                const currentNotifications = JSON.parse(savedNotifications);

                const newNotifications = nearbyDiscounts.map((discount, index) => {
                    // Add store to notified set
                    setNotifiedStores(prev => new Set([...prev, discount.Store]));

                    return {
                        key: `nearby-${Date.now()}-${index}`,
                        title: "Nearby Discount Found!",
                        message: `${discount.Store} is offering ${discount.Discount} near you!`,
                        time: new Date().toLocaleTimeString(),
                        isNew: true
                    };
                });

                // Keep only the last 10 notifications
                const updatedNotifications = [...newNotifications, ...currentNotifications].slice(0, 10);
                await AsyncStorage.setItem('@notifications', JSON.stringify(updatedNotifications));
            } catch (error) {
                console.error('Error updating notifications:', error);
            }
        }
    };

    const resetNotifiedStores = () => {
        setNotifiedStores(new Set());
    };

    useEffect(() => {
        const interval = setInterval(() => {
            resetNotifiedStores();
        }, 3600000); // Reset every hour (3600000 ms)

        return () => clearInterval(interval);
    }, []);

    const getTagStyle = (tag) => {
        switch (tag.toLowerCase()) {
            case 'locally owned, npo':
                return {
                    text: '#27ae60',
                    bg: '#edfaf1',
                    border: '#d5f5e3'
                };
            case 'limited time':
                return {
                    text: '#e67e22',
                    bg: '#fef5ec',
                    border: '#fdebd0'
                };
            case 'locally owned':
                return {
                    text: '#27ae60',
                    bg: '#edfaf1',
                    border: '#d5f5e3'
                };
            case 'codejam special':
                return {
                    text: '#8e44ad',
                    bg: '#f4ecf7',
                    border: '#e8daef'
                };
            default:
                return {
                    text: '#ff6347',
                    bg: '#fff0ee',
                    border: '#ffe5e1'
                };
        }
    };

    const renderFoodCard = ({ item }) => (
        <TouchableOpacity
            style={styles.foodCard}
            onPress={() => {
                if (item.isCityWide) {
                    navigation.navigate('Map', {
                        initialRegion: {
                            latitude: 45.5019,
                            longitude: -73.5674,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                        },
                        selectedStore: item.Store
                    });
                } else if (item.Coordinates) {
                    const [lat, lon] = item.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                    navigation.navigate('Map', {
                        initialRegion: {
                            latitude: lat,
                            longitude: lon,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        },
                        selectedStore: item.Store
                    });
                }
            }}
        >
            <View style={styles.foodCardContent}>
                <View style={styles.foodCardHeader}>
                    <Text style={styles.foodTitle}>{item.Store}</Text>
                    <View style={styles.rightHeader}>
                        <Text style={styles.foodDiscount}>{item.Discount}</Text>
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.Store);
                            }}
                            style={styles.heartButton}
                        >
                            <Ionicons
                                name={favorites.includes(item.Store) ? "heart" : "heart-outline"}
                                size={24}
                                color={favorites.includes(item.Store) ? "#ff6347" : "#666"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.foodCategory}>{item.Category}</Text>
                <Text style={styles.foodForm}>{item.Form}</Text>
                <View style={styles.cardFooter}>
                    {item.isCityWide ? (
                        <Text style={styles.cityWideText}>
                            Available across Montreal
                        </Text>
                    ) : item.distance && (
                        <Text style={styles.distanceText}>
                            {item.distance.toFixed(2)} km away
                        </Text>
                    )}
                    {item.AdditionalTag && (
                        <View style={styles.tagContainer}>
                            <Text style={[
                                styles.additionalTag,
                                {
                                    color: getTagStyle(item.AdditionalTag).text,
                                    backgroundColor: getTagStyle(item.AdditionalTag).bg,
                                    borderColor: getTagStyle(item.AdditionalTag).border
                                }
                            ]}>
                                {item.AdditionalTag}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderSection = (title, data) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {title === "Promotions" ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.promotionsScroll}
                >
                    <View style={styles.promotionsContainer}>
                        {data.map((item, index) => (
                            <View key={index} style={[styles.promotionCardWrapper]}>
                                <TouchableOpacity
                                    style={[styles.promotionCard]}
                                    onPress={() => {
                                        if (item.Coordinates) {
                                            const [lat, lon] = item.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                                            navigation.navigate('Map', {
                                                initialRegion: {
                                                    latitude: lat,
                                                    longitude: lon,
                                                    latitudeDelta: 0.01,
                                                    longitudeDelta: 0.01,
                                                },
                                                selectedStore: item.Store
                                            });
                                        }
                                    }}
                                >
                                    <View style={styles.promotionContent}>
                                        <View style={styles.promotionBadge}>
                                            <Text style={styles.promotionBadgeText}>SPECIAL</Text>
                                        </View>
                                        <Text style={styles.promotionTitle}>{item.Store}</Text>
                                        <Text style={styles.promotionDiscount}>{item.Discount}</Text>
                                        {item.AdditionalTag && (
                                            <Text style={styles.promotionTag}>{item.AdditionalTag}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.foodCardsContainer}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.foodCardWrapper}>
                            {renderFoodCard({ item })}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    const filteredAndSortedData = () => {
        let data = locationsWithDistance;
        if (searchQuery) {
            data = data.filter(item =>
                item.Store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.Category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (activeTab === 'Favorites') {
            data = data.filter(item => favorites.includes(item.Store));
        }

        return data.sort((a, b) => {
            if (a.isCityWide) return 1;
            if (b.isCityWide) return -1;
            if (!a.distance && !b.distance) return 0;
            if (!a.distance) return 1;
            if (!b.distance) return -1;
            return a.distance - b.distance;
        });
    };

    const promotions = locationsWithDistance.filter(item =>
        item.Promotions === "1"
    );

    const renderContent = () => {
        if (activeTab === 'Favorites') {
            const favoriteItems = locationsWithDistance
                .filter(item => favorites.includes(item.Store))
                .sort((a, b) => a.Store.localeCompare(b.Store));

            if (favoriteItems.length === 0) {
                return (
                    <View style={styles.emptyState}>
                        <Ionicons name="heart" size={64} color="#ddd" />
                        <Text style={styles.emptyStateText}>No favorites yet</Text>
                        <Text style={styles.emptyStateSubtext}>
                            Start adding your favorite places by tapping the heart icon
                        </Text>
                    </View>
                );
            }

            return (
                <View style={styles.foodCardsContainer}>
                    {favoriteItems.map((item, index) => (
                        <View key={index} style={styles.foodCardWrapper}>
                            {renderFoodCard({ item })}
                        </View>
                    ))}
                </View>
            );
        } else {
            return (
                <>
                    {!searchQuery && renderSection("Promotions", promotions)}
                    {renderSection(
                        searchQuery ? "Search Results" : "Nearby",
                        filteredAndSortedData()
                    )}
                </>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>DishCount</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Notifications')}
                    style={styles.notificationButton}
                >
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Explore restaurants..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Explore' && styles.activeTab]}
                    onPress={() => setActiveTab('Explore')}
                >
                    <Text style={[styles.tabText, activeTab === 'Explore' && styles.activeTabText]}>
                        Explore
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Favorites' && styles.activeTab]}
                    onPress={() => setActiveTab('Favorites')}
                >
                    <Text style={[styles.tabText, activeTab === 'Favorites' && styles.activeTabText]}>
                        Favorites
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                {renderContent()}
            </ScrollView>

            <TouchableOpacity
                style={styles.mapButton}
                onPress={() => navigation.navigate('Map')}
            >
                <Text style={styles.mapButtonText}>Search Nearby Discounts</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 8,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    notificationButton: {
        padding: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f5f5f5',
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    scrollView: {
        flex: 1,
    },
    foodCardsContainer: {
        padding: 16,
        paddingTop: 8,
    },
    foodCardWrapper: {
        marginBottom: 16,
    },
    foodCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginBottom: 16,
    },
    foodCardContent: {
        padding: 16,
    },
    foodCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    foodTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    rightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    foodDiscount: {
        fontSize: 16,
        color: '#ff6347',
        fontWeight: '600',
        marginRight: 8,
    },
    foodCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    foodForm: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    distanceText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    cityWideText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        fontStyle: 'italic',
    },
    tagContainer: {
        alignSelf: 'flex-end',
    },
    additionalTag: {
        fontSize: 11,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
    },
    heartButton: {
        padding: 4,
    },
    mapButton: {
        backgroundColor: '#ff6347',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mapButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 16,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: '#ff6347',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
        marginBottom: 12,
        color: '#333',
    },
    promotionsScroll: {
        marginBottom: 8,
    },
    promotionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    promotionCardWrapper: {
        width: Dimensions.get('window').width - 32,
        marginRight: 16,
    },
    promotionCard: {
        backgroundColor: '#ff6347',
        borderRadius: 16,
        height: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        width: '100%',
    },
    promotionContent: {
        padding: 16,
        flex: 1,
        justifyContent: 'space-between',
    },
    promotionBadge: {
        backgroundColor: 'white',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    promotionBadgeText: {
        color: '#ff6347',
        fontWeight: 'bold',
        fontSize: 12,
    },
    promotionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
    },
    promotionDiscount: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 4,
    },
    promotionTag: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        marginTop: 4,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        marginTop: 50,  // Add some top margin for better positioning
    },
    emptyStateText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        color: '#333',
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#888',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});
