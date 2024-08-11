import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import ProtectedRoute from '../auth/ProtectedRoute';

const RootLayout = () => {
    return (
        <ProtectedRoute>
            <Tabs>
                <Tabs.Screen
                    name='index'
                    options={{
                        headerShown: false,
                        title: 'Home',
                        tabBarIcon: ({ color }) => <FontAwesome size={26} name='home' color={color} />
                    }}
                />
                <Tabs.Screen
                    name='Profile'
                    options={{
                        headerShown: false,
                        title: 'Profile',
                        tabBarIcon: ({ color }) => <FontAwesome size={26} name='user' color={color} />
                    }}
                />
                <Tabs.Screen
                    name='Settings'
                    options={{
                        headerShown: false,
                        title: 'Settings',
                        tabBarIcon: ({ color }) => <FontAwesome size={26} name='cog' color={color} />
                    }}
                />
                <Tabs.Screen
                    name='About'
                    options={{
                        headerShown: false,
                        title: 'About',
                        tabBarIcon: ({ color }) => <FontAwesome size={26} name='info' color={color} />
                    }}
                />
            </Tabs>
        </ProtectedRoute>
    );
};

export default RootLayout;