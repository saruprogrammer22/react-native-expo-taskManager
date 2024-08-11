import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { Alert } from "react-native";
import useUserStore from "../store/userStore";
import { DeleteUserResponse, LoginError, UpdateUserData, User, UserDataForm, UserLoginType } from "../../types/types";

const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.0.102:8088';

export const useCreateUser = () => {
    return useMutation({
        mutationFn: async (data: UserDataForm) => await axios.post(`${API_BASE_URL}/api/my/user/`, data),
        onSuccess: (response) => {
            Alert.alert('User Created', 'Your account has been created successfully!');
            console.log('User created successfully:', response.data);
        },
        onError: (error: AxiosError) => {
            const errorMessage = 'An unexpected error occurred';
            Alert.alert('User Creation Failed', errorMessage);
            console.error('User creation error:', error);
        },
    });
};

interface UserLoginResponse {
    token: string;
    userId: number;
}

export const useLoginUser = () => {
    const setUser = useUserStore((state) => state.setUser);

    return useMutation<UserLoginResponse, AxiosError<LoginError>, UserLoginType>({
        mutationFn: async (data: UserLoginType) => {
            const response = await axios.post<UserLoginResponse>(
                `${API_BASE_URL}/api/my/user/sign-in`,
                data
            );
            return response.data;
        },
        onSuccess: async (data) => {
            try {
                await SecureStore.setItemAsync('authToken', data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                setUser(data.token, data.userId);
                Alert.alert('Success', 'You have successfully logged in!');
                router.push('/(tabs)');
            } catch (storeError) {
                console.error('Error storing token:', storeError);
                Alert.alert('Error', 'Failed to save authentication token. Please try again.');
            }
        },
        onError: (error) => {
            let errorMessage = 'An unexpected error occurred. Please try again later.';
            if (axios.isAxiosError(error) && error.response) {
                const statusCode = error.response.status;
                if (statusCode === 401) {
                    errorMessage = 'Invalid email or password. Please try again.';
                } else if (statusCode === 404) {
                    errorMessage = 'No account found with this email address.';
                } else if (statusCode === 500) {
                    errorMessage = 'There was a problem with the server. Please try again later.';
                } else {
                    errorMessage = error.response.data?.message || errorMessage;
                }
            }
            Alert.alert('Login Failed', errorMessage);
            console.error('Login error:', error);
        },
    });
};

export const useSignOutUser = () => {
    return useMutation({
        mutationFn: async () => {
            await axios.post(`${API_BASE_URL}/api/my/user/sign-out`);
        },
        onSuccess: async () => {
            try {
                await SecureStore.deleteItemAsync('authToken');
                delete axios.defaults.headers.common['Authorization'];
                Alert.alert("Success", "You have successfully logged out.");
                router.push("/auth/login");
            } catch (error) {
                console.error('Error during sign-out cleanup:', error);
                Alert.alert("Error", "Sign-out was successful, but there was a problem cleaning up locally.");
            }
        },
        onError: (error) => {
            let errorMessage = 'An unexpected error occurred during logout. Please try again later.';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data?.error || errorMessage;
            }
            Alert.alert('Logout Failed', errorMessage);
            console.error('Logout error:', error);
        },
    });
};

export const useUpdateUser = () => {
    const { userId, token } = useUserStore((state) => ({
        token: state.token,
        userId: state.userId,
    }));

    return useMutation({
        mutationFn: async (data: UpdateUserData) => {
            const response = await axios.put(`${API_BASE_URL}/api/my/user/${userId}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        },
        onSuccess: () => {
            Alert.alert("Success", "User information updated successfully");
        },
        onError: (error) => {
            let errorMessage = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            Alert.alert('Update Failed', errorMessage);
            console.error('Update error:', error);
        },
    });
};

export const useGetMyCurrentUser = () => {
    const { userId, token } = useUserStore((state) => ({
        userId: state.userId,
        token: state.token,
    }));

    const getUser = useUserStore((state) => state.getUser);

    return useQuery<User, AxiosError<{ error: string }>>({
        queryKey: ['currentUser', userId],
        queryFn: async () => {
            if (!userId || !token) throw new Error('User ID or token not available');
            const response = await axios.get<{ result: User }>(`${API_BASE_URL}/api/my/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            getUser(response.data.result, userId);
            return response.data.result;
        },
        enabled: !!userId && !!token,
        staleTime: 60000,
    });
};

export const useDeleteMyUser = () => {
    const { userId, token, clearUser } = useUserStore((state) => ({
        userId: state.userId,
        token: state.token,
        clearUser: state.clearUser,
    }));

    return useMutation<DeleteUserResponse, AxiosError<DeleteUserResponse>, void>({
        mutationFn: async () => {
            if (!userId || !token) throw new Error('User ID or token not available');
            const response = await axios.delete<DeleteUserResponse>(`${API_BASE_URL}/api/my/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        },
        onSuccess: async (data) => {
            await SecureStore.deleteItemAsync('authToken');
            delete axios.defaults.headers.common['Authorization'];
            clearUser();
            Alert.alert('Success', data.message || 'User account deleted successfully');
            router.push('/auth/login');
        },
        onError: (error) => {
            let errorMessage = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error || errorMessage;
            }
            Alert.alert('Delete Failed', errorMessage);
            console.error('Delete error:', error);
        },
    });
};
