const API_URL = 'http://localhost:5000/notifications/';

class NotificationService {
    // Create a notification
    async createNotification(notificationData) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
            body: JSON.stringify(notificationData), // Pass the notification data in the request body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return created notification
    }

    // Get all notifications for the logged-in user
    async getNotifications() {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json(); // Return list of notifications
    }

    // Mark notification as read
    async markAsRead(notificationId) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(`${API_URL}${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return updated notification
    }

    // Delete a notification
    async deleteNotification(notificationId) {
        const token = JSON.parse(localStorage.getItem('user')).token;

        const response = await fetch(`${API_URL}${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Use JWT for authentication
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${errorData.message}`);
        }

        return response.json(); // Return confirmation of deletion
    }
}

export default new NotificationService();
