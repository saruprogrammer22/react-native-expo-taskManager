import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const Home = () => {
    const router = useRouter();

    const [scaleValue] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to TaskManager!</Text>
            <Text style={styles.subtitle}>Manage your tasks efficiently</Text>
            <View style={styles.buttonsContainer}>
                <AnimatedTouchable
                    style={[styles.button, { transform: [{ scale: scaleValue }] }]}
                    onPress={() => router.push("/auth/Login")}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </AnimatedTouchable>
                <AnimatedTouchable
                    style={[styles.button, { transform: [{ scale: scaleValue }] }]}
                    onPress={() => router.push("/auth/SignUp")}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </AnimatedTouchable>
            </View>
            <Text style={styles.footer}>Developed by JosephDatDev22</Text>
        </View>
    );
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '80%',
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#000000',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        marginTop: 50,
        fontSize: 14,
        color: '#888888',
        textAlign: 'center',
    },
});

export default Home;
