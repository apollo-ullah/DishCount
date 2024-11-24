import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen = ({ navigation }) => {
    const [notifications, setNotifications] = React.useState([]);
    let rowRefs = new Map();

    React.useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const notifs = await AsyncStorage.getItem('notifications');
            setNotifications(notifs ? JSON.parse(notifs) : []);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const deleteNotification = async (index) => {
        try {
            const newNotifications = [...notifications];
            newNotifications.splice(index, 1);
            await AsyncStorage.setItem('notifications', JSON.stringify(newNotifications));
            setNotifications(newNotifications);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const renderRightActions = (progress, dragX, index) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 100],
        });

        return (
            <Animated.View
                style={[
                    styles.deleteButton,
                    {
                        transform: [{ translateX: trans }],
                    },
                ]}>
                <TouchableOpacity
                    onPress={() => deleteNotification(index)}
                    style={styles.deleteButtonInner}>
                    <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const clearAllNotifications = async () => {
        Alert.alert(
            "Clear All Notifications",
            "Are you sure you want to clear all notifications?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear All",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.setItem('notifications', JSON.stringify([]));
                        setNotifications([]);
                    }
                }
            ]
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {notifications.length > 0 && (
                        <TouchableOpacity
                            onPress={clearAllNotifications}
                            style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <Swipeable
                            key={index}
                            ref={ref => {
                                if (ref && !rowRefs.get(index)) {
                                    rowRefs.set(index, ref);
                                }
                            }}
                            renderRightActions={(progress, dragX) =>
                                renderRightActions(progress, dragX, index)}
                            rightThreshold={40}
                            overshootRight={false}
                        >
                            <View style={styles.notificationItem}>
                                <Text style={styles.notificationTitle}>{notification.title}</Text>
                                <Text style={styles.notificationBody}>{notification.body}</Text>
                                <Text style={styles.notificationTime}>
                                    {new Date(notification.timestamp).toLocaleString()}
                                </Text>
                            </View>
                        </Swipeable>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle-outline" size={50} color="#888" />
                        <Text style={styles.emptyStateText}>You're all caught up!</Text>
                        <Text style={styles.emptyStateSubtext}>
                            No notifications at the moment
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 16,
    },
    clearButton: {
        padding: 8,
    },
    clearButtonText: {
        color: '#ff3b30',
        fontSize: 16,
    },
    notificationItem: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    notificationBody: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    deleteButton: {
        backgroundColor: '#ff3b30',
        width: 80,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    },
});

export default NotificationScreen;
