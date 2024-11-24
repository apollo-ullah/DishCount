import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView, Platform, StatusBar, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import discountData from './assets/discountData';

// TabBar Component
const TabBar = ({ activeTab, setActiveTab }) => {
    const tabs = ['Explore', 'Favorites', 'Food', 'Other'];

    return (
        <View style={tabStyles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={tabStyles.tabButton}
                >
                    <Text style={[tabStyles.tabText, activeTab === tab && tabStyles.activeTabText]}>
                        {tab}
                    </Text>
                    {activeTab === tab && <View style={tabStyles.indicator} />}
                </TouchableOpacity>
            ))}
        </View>
    );
};

// HomeScreen Component
const HomeScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Explore');
    const [favorites, setFavorites] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const scrollY = useRef(new Animated.Value(0)).current;
    const heartScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setRestaurants(discountData);
    }, []);

    const toggleFavorite = (name) => {
        const isFavorite = favorites.includes(name);

        // Heart animation
        Animated.sequence([
            Animated.timing(heartScale, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(heartScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        setFavorites((prevFavorites) =>
            isFavorite
                ? prevFavorites.filter((item) => item !== name)
                : [...prevFavorites, name]
        );
    };

    // Add console log in render to see what's being passed to FlatList
    console.log('Rendering with restaurants:', restaurants);

    // Modify your renderFoodCard to include a console log
    const renderFoodCard = ({ item }) => {
        return (
            <TouchableOpacity key={item.Store} style={styles.card}>
                <View style={styles.cardContent}>
                    <View>
                        <Text style={styles.cardTitle}>{item.Store}</Text>
                        <Text style={styles.cardDiscount}>{item.Discount}</Text>
                        <Text style={styles.cardForm}>{item.Form}</Text>
                        <Text style={styles.cardCategory}>{item.Category}</Text>
                    </View>
                    <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                        <TouchableOpacity
                            onPress={() => toggleFavorite(item.Store)}
                            style={styles.heartButton}
                        >
                            <Ionicons
                                name={favorites.includes(item.Store) ? "heart" : "heart-outline"}
                                size={24}
                                color={favorites.includes(item.Store) ? "#ff3b30" : "#666"}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Discover Discounts</Text>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>

                {/* TabBar */}
                <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Content */}
                {activeTab === 'Explore' && (
                    <FlatList
                        data={restaurants}
                        renderItem={renderFoodCard}
                        keyExtractor={item => item.Store}
                        contentContainerStyle={styles.scrollContent}
                        ListHeaderComponent={() => (
                            <Text style={styles.sectionTitle}>Student Discounts</Text>
                        )}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyStateContainer}>
                                <Text style={styles.noFavoritesText}>No discounts available</Text>
                                <Text style={styles.noFavoritesSubtext}>
                                    Please check back later
                                </Text>
                            </View>
                        )}
                    />
                )}
                {activeTab === 'Favorites' && (
                    <>
                        {favorites.length > 0 ? (
                            <FlatList
                                data={restaurants.filter(r => favorites.includes(r.Store))}
                                renderItem={renderFoodCard}
                                keyExtractor={item => item.Store}
                                contentContainerStyle={styles.scrollContent}
                            />
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <Ionicons name="heart-outline" size={80} color="#ff3b30" />
                                <Text style={styles.noFavoritesText}>No favorites yet</Text>
                                <Text style={styles.noFavoritesSubtext}>
                                    Save your favorite restaurants to access them quickly
                                </Text>
                            </View>
                        )}
                    </>
                )}

                {/* Map Button */}
                <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => navigation.navigate('Map')}
                >
                    <Ionicons name="map-outline" size={20} color="#fff" style={styles.mapIcon} />
                    <Text style={styles.mapButtonText}>View Nearby Discounts</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    notificationButton: {
        position: 'relative',
        padding: 8,
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff3b30',
    },
    scrollContainer: {
        flex: 1,
        marginTop: 16,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 16,
        color: '#333',
    },
    cardContainer: {
        gap: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 12,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    cardDiscount: {
        fontSize: 16,
        color: '#ff6347',
        fontWeight: '500',
    },
    cardForm: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    heartButton: {
        padding: 8,
    },
    emptyStateContainer: {
        alignItems: 'center',
        marginVertical: 40,
        paddingHorizontal: 24,
    },
    noFavoritesText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
    },
    noFavoritesSubtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
    },
    mapButton: {
        marginVertical: 16,
        backgroundColor: '#ff6347',
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ff6347',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    mapIcon: {
        marginRight: 8,
    },
    mapButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

const tabStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 56,
        borderRadius: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    tabButton: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    activeTabText: {
        color: '#ff6347',
        fontWeight: '600',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        width: '50%',
        height: 3,
        backgroundColor: '#ff6347',
        borderRadius: 1.5,
    },
});

export default HomeScreen;
