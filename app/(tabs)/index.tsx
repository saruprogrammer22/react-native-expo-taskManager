import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    FlatList,
    SafeAreaView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { useCreateTask, useDeleteMyTask, useGetMyTasks } from '../(services)/api/MyTaskApi';
import RenderTaskItem from '../component/RenderTaskItem';

// Define Zod schema for form validation
const taskFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    status: z.enum(['Low', 'Medium', 'High', 'pending', 'in-progress', 'completed']),
});

// Define form data type
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

    const { data: tasks, refetch, isFetching } = useGetMyTasks();

    const createTaskMutation = useCreateTask();
    const deleteTaskMutation = useDeleteMyTask()


    const onSubmit = async (data: TaskFormData) => {
        try {
            setIsLoading(true);
            await createTaskMutation.mutateAsync(data);
            setModalVisible(false);
            reset();
            setIsLoading(false);
            await refetch(); // Refetch tasks after successful creation
        } catch (error) {
            console.error('Submission error:', error);
            setIsLoading(false);
        }
    };

    const onDelete = async (taskId: number) => {
        deleteTaskMutation.mutate(taskId)
        console.log(`Deleting task with ID: ${taskId}`);
        await refetch()
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
                                        <Picker.Item label="Low" value="low" />
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
                <RenderTaskItem tasks={tasks} onDelete={onDelete} />
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
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    cancelButton: {
        backgroundColor: '#888',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
    },
    apiErrorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    taskItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    taskCategory: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    taskStatus: {
        fontSize: 14,
        color: '#666',
    },
    loader: {
        marginTop: 20,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});
