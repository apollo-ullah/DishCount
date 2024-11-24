import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import discountData from '../assets/discountData';

const PROXIMITY_RADIUS = 10; // meters for real-time notifications
const LAST_LOCATION_KEY = 'last_location_data';
const NOTIFICATIONS_STORAGE_KEY = 'notifications';
const notifiedStores = new Set();

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Calculate distance between points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Add this function to store notifications
async function storeNotification(notification) {
    try {
        console.log('Storing new notification:', notification);  // Debug log
        const existingData = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        console.log('Existing notifications:', existingData);    // Debug log
        const notifications = existingData ? JSON.parse(existingData) : [];

        const newNotification = {
            ...notification,
            timestamp: Date.now()
        };

        notifications.unshift(newNotification);

        if (notifications.length > 50) {
            notifications.pop();
        }

        await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
        console.log('Successfully stored notification');         // Debug log
    } catch (error) {
        console.error('Error storing notification:', error);
    }
}

// Real-time notifications when app is open
async function checkNearbyDiscounts(location) {
    const { latitude, longitude } = location.coords;

    discountData.forEach(async (discount) => {
        const [venueLat, venueLng] = discount.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
        const distance = calculateDistance(latitude, longitude, venueLat, venueLng);

        if (distance <= PROXIMITY_RADIUS && !notifiedStores.has(discount.Store)) {
            console.log(`Near ${discount.Store}! Distance: ${distance.toFixed(2)}m`);

            const notification = {
                title: "Discount Nearby! 🎉",
                body: `You're near ${discount.Store}! Show your ${discount.Form} for ${discount.Discount} off!`,
                store: discount.Store,
                discount: discount.Discount,
                form: discount.Form
            };

            // Show the notification
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: notification.title,
                    body: notification.body,
                },
                trigger: null,
            });

            // Store the notification
            await storeNotification(notification);

            notifiedStores.add(discount.Store);

            // Reset after 24 hours
            setTimeout(() => {
                notifiedStores.delete(discount.Store);
            }, 24 * 60 * 60 * 1000);
        }
    });

    // Store location for missed discount check
    await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({
        coords: location.coords,
        timestamp: Date.now()
    }));
}

// Check for missed discounts when app reopens
export async function checkMissedDiscounts() {
    try {
        const lastLocationStr = await AsyncStorage.getItem(LAST_LOCATION_KEY);
        if (!lastLocationStr) return null;

        const lastLocation = JSON.parse(lastLocationStr);
        const currentLocation = await Location.getCurrentPositionAsync({});
        const timeDiff = Date.now() - lastLocation.timestamp;

        // Only check if less than 10 minutes passed
        if (timeDiff > 10 * 60 * 1000) return null;

        // Calculate velocity
        const distance = calculateDistance(
            lastLocation.coords.latitude,
            lastLocation.coords.longitude,
            currentLocation.coords.latitude,
            currentLocation.coords.longitude
        );

        const velocity = distance / (timeDiff / 1000); // meters per second
        console.log('Current velocity:', velocity.toFixed(2), 'm/s'); // Debug log

        // Skip if velocity is too low (essentially stationary)
        if (velocity < 0.5) {
            console.log('User is stationary, skipping missed discount check');
            return null;
        }

        const missedDiscounts = [];
        discountData.forEach(discount => {
            const [venueLat, venueLng] = discount.Coordinates.split(',').map(coord => parseFloat(coord.trim()));

            // Check if the discount location is between last and current location
            const distanceToLast = calculateDistance(
                lastLocation.coords.latitude,
                lastLocation.coords.longitude,
                venueLat,
                venueLng
            );

            const distanceToCurrent = calculateDistance(
                currentLocation.coords.latitude,
                currentLocation.coords.longitude,
                venueLat,
                venueLng
            );

            const totalDistance = calculateDistance(
                lastLocation.coords.latitude,
                lastLocation.coords.longitude,
                currentLocation.coords.latitude,
                currentLocation.coords.longitude
            );

            // If the store is near the path taken
            if (distanceToLast + distanceToCurrent < totalDistance + 50) { // 50m buffer
                missedDiscounts.push(discount);
            }
        });

        if (missedDiscounts.length > 0) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Missed Discounts! 🏃‍♂️",
                    body: `You passed by ${missedDiscounts.length} location${missedDiscounts.length > 1 ? 's' : ''} with student discounts!`,
                },
                trigger: null,
            });
        }

        return missedDiscounts;
    } catch (error) {
        console.error('Error checking missed discounts:', error);
        return null;
    }
}

// Start location tracking for real-time notifications
export async function startLocationTracking() {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permission to access location was denied');
        }

        await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 10000,
                distanceInterval: 5,
            },
            checkNearbyDiscounts
        );

        console.log('Location tracking started');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Add this function to get notifications (can be used in NotificationScreen)
export async function getNotifications() {
    try {
        const data = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
}


