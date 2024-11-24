import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import discountData from '../assets/discountData';

const LAST_LOCATION_KEY = 'last_location_data';
const MAX_TIME_DIFFERENCE = 10 * 60 * 1000; // 10 minutes in milliseconds
const MAX_VELOCITY = 6; // meters per second
const NOTIFICATION_HISTORY_KEY = 'notification_history';

// Calculate distance between two points in meters using Haversine formula
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

// Calculate midpoint between two locations
function calculateMidpoint(lat1, lon1, lat2, lon2) {
    return {
        latitude: (lat1 + lat2) / 2,
        longitude: (lon1 + lon2) / 2
    };
}

// Check if a point is within a circle
function isPointInCircle(pointLat, pointLon, centerLat, centerLon, radius) {
    const distance = calculateDistance(pointLat, pointLon, centerLat, centerLon);
    return distance <= radius;
}

// Store current location
export async function storeCurrentLocation(location) {
    try {
        const locationData = {
            coords: location.coords,
            timestamp: Date.now()
        };
        await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(locationData));
    } catch (error) {
        console.error('Error storing location:', error);
    }
}

// Add notification to history
async function addToNotificationHistory(notification) {
    try {
        const history = await getNotificationHistory();
        history.unshift({
            ...notification,
            timestamp: Date.now()
        });
        // Keep only last 50 notifications
        if (history.length > 50) history.pop();
        await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error adding to notification history:', error);
    }
}

// Get notification history
export async function getNotificationHistory() {
    try {
        const history = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error getting notification history:', error);
        return [];
    }
}

// Check for missed discounts
export async function checkMissedDiscounts() {
    try {
        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({});
        const currentTime = Date.now();

        // Get last stored location
        const lastLocationStr = await AsyncStorage.getItem(LAST_LOCATION_KEY);
        if (!lastLocationStr) {
            await storeCurrentLocation(currentLocation);
            return null;
        }

        const lastLocation = JSON.parse(lastLocationStr);
        const timeDifference = currentTime - lastLocation.timestamp;

        // Skip if time difference is too large
        if (timeDifference > MAX_TIME_DIFFERENCE) {
            await storeCurrentLocation(currentLocation);
            return null;
        }

        // Calculate velocity
        const distance = calculateDistance(
            lastLocation.coords.latitude,
            lastLocation.coords.longitude,
            currentLocation.coords.latitude,
            currentLocation.coords.longitude
        );
        const velocity = distance / (timeDifference / 1000); // meters per second

        // Skip if velocity is too high
        if (velocity > MAX_VELOCITY) {
            await storeCurrentLocation(currentLocation);
            return null;
        }

        // Calculate midpoint and radius for geofence
        const midpoint = calculateMidpoint(
            lastLocation.coords.latitude,
            lastLocation.coords.longitude,
            currentLocation.coords.latitude,
            currentLocation.coords.longitude
        );
        const radius = distance / 2;

        // Check for discounts within geofence
        const missedDiscounts = discountData.filter(discount => {
            const [lat, lon] = discount.Coordinates.split(',').map(coord => parseFloat(coord.trim()));
            return isPointInCircle(lat, lon, midpoint.latitude, midpoint.longitude, radius);
        });

        // Store notifications in history
        if (missedDiscounts.length > 0) {
            const notification = {
                title: 'Missed Discounts Nearby!',
                body: `You passed by ${missedDiscounts.length} location${missedDiscounts.length > 1 ? 's' : ''} with student discounts!`,
                discounts: missedDiscounts
            };
            await addToNotificationHistory(notification);
        }

        // Store current location for next time
        await storeCurrentLocation(currentLocation);

        return missedDiscounts.length > 0 ? missedDiscounts : null;
    } catch (error) {
        console.error('Error checking missed discounts:', error);
        return null;
    }
} 