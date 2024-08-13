import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { useCreateTask, useDeleteMyTask, useGetMyTasks } from '../(services)/api/MyTaskApi';
import RenderTaskItem from '../component/RenderTaskItem';
import useTaskStore from '../(services)/store/taskStore';

const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    status: z.enum(['Low', 'Medium', 'High', 'pending', 'in-progress', 'completed']),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

const TaskForm: React.FC = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: '',
            category: '',
            status: 'pending',
        },
    });

    const { refetch, isFetching } = useGetMyTasks();
    const { tasks } = useTaskStore((state) => ({
        tasks: state.tasks
    }));
    const createTaskMutation = useCreateTask();
    const deleteTaskMutation = useDeleteMyTask();

    useEffect(() => {
        refetch();
    }, []);

    const onSubmit = async (data: TaskFormData) => {
        setIsLoading(true);
        try {
            await createTaskMutation.mutateAsync(data);
            setModalVisible(false);
            reset();
            await refetch();
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async (taskId: number) => {
        try {
            deleteTaskMutation.mutate(taskId, {
                onSuccess: async () => {
                    await refetch();
                },
                onError: (error) => {
                    console.error(`Failed to delete task with ID: ${taskId}`, error);
                    Alert.alert('Error', 'Failed to delete task. Please try again.');
                }
            });
        } catch (error) {
            console.error(`Error deleting task with ID: ${taskId}`, error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Task</Text>
            </TouchableOpacity>

            <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add New Task</Text>

                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Title</Text>
                                <TextInput
                                    style={[styles.input, errors.title && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Enter task title"
                                    placeholderTextColor="#aaa"
                                />
                                {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="category"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Category</Text>
                                <TextInput
                                    style={[styles.input, errors.category && styles.inputError]}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Enter task category"
                                    placeholderTextColor="#aaa"
                                />
                                {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="status"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Status</Text>
                                <View style={[styles.pickerContainer, errors.status && styles.inputError]}>
                                    <Picker
                                        selectedValue={value}
                                        style={styles.picker}
                                        onValueChange={onChange}
                                    >
                                        <Picker.Item label="Select Status" value="" />
                                        <Picker.Item label="Low" value="Low" />
                                        <Picker.Item label="Medium" value="Medium" />
                                        <Picker.Item label="High" value="High" />
                                        <Picker.Item label="Pending" value="pending" />
                                        <Picker.Item label="In Progress" value="in-progress" />
                                        <Picker.Item label="Completed" value="completed" />
                                    </Picker>
                                </View>
                                {errors.status && <Text style={styles.errorText}>{errors.status.message}</Text>}
                            </View>
                        )}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {isFetching ? (
                <ActivityIndicator style={styles.loader} />
            ) : tasks && tasks.length > 0 ? (
                <RenderTaskItem onDelete={onDelete} tasks={tasks} />
            ) : (
                <Text style={styles.emptyListText}>No tasks available</Text>
            )}
        </SafeAreaView>
    );
};

export default TaskForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    addButton: {
        backgroundColor: '#1E1E1E',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#f0f0f0',
    },
    inputError: {
        borderColor: 'red',
    },
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#1E1E1E',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    cancelButton: {
        backgroundColor: '#ddd',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: '700',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
    },
    loader: {
        marginTop: 50,
    },
    emptyListText: {
        marginTop: 50,
        fontSize: 18,
        color: '#777',
        textAlign: 'center',
    },
});
