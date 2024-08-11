
import React from 'react'
import { Stack } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './(services)/queryClient'
const RootLayout = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Stack>
                <Stack.Screen
                    name='index'
                    options={{ headerShown: false, title: "Welcome" }}
                />
            </Stack>
        </QueryClientProvider>
    )
}

export default RootLayout

