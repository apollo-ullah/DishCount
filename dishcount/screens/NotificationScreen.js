import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationsScreen({ navigation }) {
    const [notifications, setNotifications] = useState([]);

    // Load notifications on mount
    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const savedNotifications = await AsyncStorage.getItem('@notifications');
            if (savedNotifications !== null) {
                setNotifications(JSON.parse(savedNotifications));
            } else {
                // Default notifications if none exist
                const defaultNotifications = [
                    {
                        key: '1',
                        title: "Welcome to DishCount!",
                        message: "Discover student discounts around McGill.",
                        time: "Just now",
                        isNew: true
                    }
                ];
                setNotifications(defaultNotifications);
                await AsyncStorage.setItem('@notifications', JSON.stringify(defaultNotifications));
            }
        } catch (error) {
            console.log('Error loading notifications:', error);
        }
    };

    const saveNotifications = async (newNotifications) => {
        try {
            await AsyncStorage.setItem('@notifications', JSON.stringify(newNotifications));
            setNotifications(newNotifications);
        } catch (error) {
            console.log('Error saving notifications:', error);
        }
    };

    const deleteNotification = async (key) => {
        const newNotifications = notifications.filter(notification => notification.key !== key);
        await saveNotifications(newNotifications);
    };

    const clearAllNotifications = async () => {
        await saveNotifications([]);
    };

    const renderItem = ({ item }) => (
        <Animated.View style={styles.notificationCard}>
            <View style={styles.notificationContent}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    {item.isNew && (
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
        </Animated.View>
    );

    const renderHiddenItem = (data) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteNotification(data.item.key)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#ff6347" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                {notifications.length > 0 && (
                    <TouchableOpacity onPress={clearAllNotifications}>
                        <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>
            {notifications.length > 0 ? (
                <SwipeListView
                    data={notifications}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    friction={50}
                    tension={30}
                    style={styles.container}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No notifications</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 16,
        zIndex: 1,
    },
    backText: {
        color: '#ff6347',
        fontSize: 17,
        marginLeft: -4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
        flex: 1,
    },
    clearAllText: {
        color: '#ff6347',
        fontSize: 16,
        position: 'absolute',
        right: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    notificationCard: {
        backgroundColor: 'white',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    notificationContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    message: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    newBadge: {
        backgroundColor: '#ff6347',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    newBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 15,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
        borderRadius: 12,
    },
    backRightBtnRight: {
        backgroundColor: '#FF3B30',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
});
