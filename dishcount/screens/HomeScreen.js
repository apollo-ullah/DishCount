import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import discountData from '../assets/discountData';

export default function HomeScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Explore');
    const [favorites, setFavorites] = useState([]);

    const filteredData = discountData.filter(item =>
        item.Store.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleFavorite = (store) => {
        setFavorites(prev =>
            prev.includes(store)
                ? prev.filter(s => s !== store)
                : [...prev, store]
        );
    };

    const renderFoodCard = ({ item }) => (
        <TouchableOpacity
            style={styles.foodCard}
            onPress={() => {
                const [lat, lon] = item.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                navigation.navigate('Map', {
                    initialRegion: {
                        latitude: lat,
                        longitude: lon,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001,
                    },
                    selectedStore: item.Store
                });
            }}
        >
            <View style={styles.foodCardContent}>
                <View style={styles.foodCardHeader}>
                    <Text style={styles.foodTitle}>{item.Store}</Text>
                    <View style={styles.rightHeader}>
                        <Text style={styles.foodDiscount}>{item.Discount}</Text>
                        <TouchableOpacity
                            onPress={() => toggleFavorite(item.Store)}
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
            </View>
        </TouchableOpacity>
    );

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
                <View style={styles.foodCardsContainer}>
                    {(activeTab === 'Explore' ? filteredData : filteredData.filter(item => favorites.includes(item.Store)))
                        .map((item, index) => (
                            <View key={index} style={styles.foodCardWrapper}>
                                {renderFoodCard({ item })}
                            </View>
                        ))}
                </View>
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
    foodDiscount: {
        fontSize: 16,
        color: '#ff6347',
        fontWeight: '600',
        marginRight: 4,
    },
    foodCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    foodForm: {
        fontSize: 12,
        color: '#999',
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
    rightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heartButton: {
        marginLeft: 8,
        padding: 4,
    },
});
