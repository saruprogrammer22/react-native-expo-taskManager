import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDeleteMyUser, useSignOutUser } from '../(services)/api/MyUserApi';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Settings: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const signOutMutation = useSignOutUser();
    const deleteAccount = useDeleteMyUser();

    const handleLogout = () => {
        setIsLoading(true);
        signOutMutation.mutate(undefined, {
            onSuccess: () => {
                router.push("/");
            },
            onSettled: () => setIsLoading(false),
        });
    };

    const handleDeleteAccount = () => {
        deleteAccount.mutate(undefined, {
            onSuccess: () => {
                router.push("/(tabs)")
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.disabledButton]}
                    onPress={handleLogout}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <>
                            <Ionicons name="log-out-outline" size={24} color="#ffffff" />
                            <Text style={styles.buttonText}>Logout</Text>
                        </>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
                    <Ionicons name="trash-outline" size={24} color="#ffffff" />
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: 24,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333333',
    },
    buttonContainer: {
        alignItems: 'stretch',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    disabledButton: {
        backgroundColor: '#A7A7A7',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default Settings;