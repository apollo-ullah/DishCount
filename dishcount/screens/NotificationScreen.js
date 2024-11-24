import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
    const notifications = [
        {
            id: 1,
            title: "Welcome to DishCount!",
            message: "Discover student discounts around McGill.",
            time: "Just now",
            isNew: true
        },
        {
            id: 2,
            title: "CodeJam Special",
            message: "Don't miss out on our special promotion!",
            time: "1h ago",
            isNew: true
        },
        {
            id: 3,
            title: "New Discount Added",
            message: "Check out the latest student offers near you.",
            time: "2h ago",
            isNew: false
        }
    ];

    return (
        <ScrollView style={styles.container}>
            {notifications.map((notification) => (
                <View
                    key={notification.id}
                    style={[
                        styles.notificationCard,
                        notification.isNew && styles.newNotification
                    ]}
                >
                    <View style={styles.notificationContent}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title}>{notification.title}</Text>
                            {notification.isNew && (
                                <View style={styles.newBadge}>
                                    <Text style={styles.newBadgeText}>NEW</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.message}>{notification.message}</Text>
                        <Text style={styles.time}>{notification.time}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    notificationCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    newNotification: {
        borderLeftWidth: 4,
        borderLeftColor: '#ff6347',
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
    },
    newBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
