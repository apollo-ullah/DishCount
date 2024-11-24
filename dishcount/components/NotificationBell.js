import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Modal, View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNotificationHistory } from '../services/MissedDiscountService';

export default function NotificationBell() {
    const [modalVisible, setModalVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadNotifications();
    }, [modalVisible]);

    async function loadNotifications() {
        const history = await getNotificationHistory();
        setNotifications(history);
    }

    const renderNotification = ({ item }) => (
        <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationBody}>{item.body}</Text>
            <Text style={styles.notificationTime}>
                {new Date(item.timestamp).toLocaleString()}
            </Text>
            {item.discounts && (
                <View style={styles.discountsList}>
                    {item.discounts.map((discount, index) => (
                        <Text key={index} style={styles.discountItem}>
                            {discount.Store}: {discount.Discount} with {discount.Form}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="notifications" size={24} color="black" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Notifications</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={notifications}
                        renderItem={renderNotification}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.notificationsList}
                    />
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    notificationsList: {
        flex: 1,
    },
    notificationItem: {
        padding: 15,
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
        marginTop: 5,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    discountsList: {
        marginTop: 10,
    },
    discountItem: {
        fontSize: 14,
        color: '#444',
        marginTop: 3,
    },
}); 