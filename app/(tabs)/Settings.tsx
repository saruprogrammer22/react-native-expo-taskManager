import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDeleteMyUser, useSignOutUser } from '../(services)/api/MyUserApi';
import { router, } from 'expo-router';


const Settings: React.FC = () => {


    const [isLoading, setIsLoading] = useState(false);
    const signOutMutation = useSignOutUser();
    const deleteAccount = useDeleteMyUser()

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
        })
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity
                style={[styles.button, isLoading && styles.disabledButton]}
                onPress={handleLogout}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Logout</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginVertical: 10,
    },
    deleteButton: {
        backgroundColor: '#FF0000',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
