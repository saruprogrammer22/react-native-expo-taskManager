import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';
import { useCreateUser } from '../(services)/api/MyUserApi';
import { useRouter } from 'expo-router';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

const SignUpForm = () => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);


    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const createUserMutation = useCreateUser()

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setApiError(null);
        try {
            createUserMutation.mutate(data)
            Alert.alert("Successfuly created an account")
            router.push("/auth/Login")
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setApiError(error.response.data.message || 'An error occurred during signup');
            } else {
                setApiError('An unexpected error occurred');
            }
            console.error('SignUp error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            {apiError && <Text style={styles.apiErrorText}>{apiError}</Text>}

            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value, onBlur } }) => (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Your Name"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="example@gmail.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value, onBlur } }) => (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Your Password"
                            secureTextEntry
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                    </View>
                )}
            />

            <TouchableOpacity
                style={[styles.button, isLoading && styles.disabledButton]}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
            </TouchableOpacity>

            <Text style={styles.ahc} onPress={() => router.push("/auth/Login")}>
                Already Have Account?
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    ahc: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 20,
        marginTop: 8,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    apiErrorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 5,
        padding: 15,
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

export default SignUpForm;