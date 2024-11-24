import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import discountData from '../assets/discountData';

// Configure notifications for Expo
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const PROXIMITY_RADIUS = 10; // 10 meters
const notifiedStores = new Set();

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

export async function startLocationAndNotifications() {
    try {
        // Request notification permissions
        const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
        if (notificationStatus !== 'granted') {
            throw new Error('Notification permissions not granted');
        }

        // Request location permissions
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
            throw new Error('Location permissions not granted');
        }

        // Start watching position
        Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Balanced,
                timeInterval: 10000,
                distanceInterval: 5,
            },
            async (location) => {
                const { latitude, longitude } = location.coords;

                discountData.forEach(async (discount) => {
                    const [venueLat, venueLng] = discount.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
                    const distance = calculateDistance(latitude, longitude, venueLat, venueLng);

                    if (distance <= PROXIMITY_RADIUS && !notifiedStores.has(discount.Store)) {
                        console.log(`Near ${discount.Store}! Distance: ${distance.toFixed(2)}m`);

                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: "Discount Nearby! 🎉",
                                body: `You're near ${discount.Store}! Show your ${discount.Form} for ${discount.Discount} off!`,
                            },
                            trigger: null,
                        });

                        notifiedStores.add(discount.Store);

                        // Reset after 24 hours
                        setTimeout(() => {
                            notifiedStores.delete(discount.Store);
                        }, 24 * 60 * 60 * 1000);
                    }
                });
            }
        );

        console.log('Location and notification tracking started');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


