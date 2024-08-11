import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import useUserStore from '../(services)/store/userStore';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { clearUser } = useUserStore((state) => ({
        clearUser: state.clearUser,
    }));

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                if (!token) {
                    clearUser();
                    Alert.alert("Session Expired", "You need to log in again.");
                    router.replace("/auth/Login"); // Use replace to prevent going back
                    setIsAuthenticated(false);
                    return;
                }

                // Set the default authorization header for axios
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to check authentication status:', error);
                setIsAuthenticated(false); // Assume the user is not authenticated in case of an error
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [clearUser, router]);

    return { isAuthenticated, loading };
};