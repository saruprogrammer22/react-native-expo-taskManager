import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MaterialIcons } from '@expo/vector-icons';
import { useGetMyCurrentUser, useUpdateUser } from '../(services)/api/MyUserApi';

// Define the schema for form validation using Zod
const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

const Profile = () => {


    const { data: user, isLoading, error, refetch } = useGetMyCurrentUser();
    const [modalVisible, setModalVisible] = React.useState(false);
    const updateMutation = useUpdateUser();

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
        },
    });


    const onSubmit = async (data: FormData) => {
        try {
            await updateMutation.mutateAsync(data);
            Alert.alert('Profile Updated', 'Your profile has been successfully updated!');
            refetch()
            setModalVisible(false);

        } catch {
            Alert.alert('Update Error', 'Failed to update profile.');
        }
    };

    useEffect(() => {

        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);
        }
    }, [user, setValue]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loading}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error.message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Profile</Text>
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Profile</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="person" size={24} color="#333" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Name"
                                    />
                                </View>
                            )}
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="email" size={24} color="#333" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Email"
                                        keyboardType="email-address"
                                    />
                                </View>
                            )}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        padding: 20,
        width: '100%',
        maxWidth: 400,
    },
    cardHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 10,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    cardContent: {
        marginBottom: 20,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    button: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loading: {
        fontSize: 18,
        color: '#333',
    },
    error: {
        fontSize: 18,
        color: '#ff0000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    closeText: {
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
});

