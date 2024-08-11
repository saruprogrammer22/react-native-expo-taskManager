import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useLoginUser } from '../(services)/api/MyUserApi';

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

type FormData = z.infer<typeof loginSchema>;

const Login = () => {
    const { control, handleSubmit, formState } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loginMutation = useLoginUser();

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            await loginMutation.mutateAsync(data);
            setIsLoading(false);
            Alert.alert('Success', 'You have successfully logged in!');
            router.push('/(tabs)'); // Navigate to the home screen or another screen on successful login
        } catch (error: any) {
            setIsLoading(false);
            if (error.response && error.response.status === 401) {
                Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
            } else if (error.response && error.response.status === 404) {
                Alert.alert('User Not Found', 'No account found with this email address.');
            } else {
                Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <TextInput
                            placeholder="Email"
                            onChangeText={onChange}
                            value={value}
                            onBlur={onBlur}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            style={styles.input}
                        />
                    )}
                />
                {formState.errors.email && <Text style={styles.errorText}>{formState.errors.email.message}</Text>}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <TextInput
                            placeholder="Password"
                            onChangeText={onChange}
                            value={value}
                            onBlur={onBlur}
                            secureTextEntry
                            style={styles.input}
                        />
                    )}
                />
                {formState.errors.password && <Text style={styles.errorText}>{formState.errors.password.message}</Text>}
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.disabledButton]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
                </TouchableOpacity>
                <Text style={styles.ahc} onPress={() => router.push("/auth/SignUp")}>
                    Don't Have an Account?
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 350,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    ahc: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 20,
        marginTop: 8,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 5,
        padding: 15,
        width: "100%",
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default Login;
