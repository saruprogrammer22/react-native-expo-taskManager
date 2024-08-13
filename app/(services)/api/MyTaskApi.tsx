import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Alert } from "react-native";
import { TaskType } from "../../types/types";
import useTaskStore from "../store/taskStore";

const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.0.102:8088';

// Create a task
export const useCreateTask = () => {
    const queryClient = useQueryClient();
    const addTask = useTaskStore((state) => state.addTask);

    return useMutation({
        mutationFn: async (data: TaskType) => {
            const response = await axios.post(`${API_BASE_URL}/api/my/task/`, data);
            return response.data;
        },
        onSuccess: (data) => {
            addTask(data.result);
            Alert.alert('Success', 'Task created successfully!');
        },
        onError: (error: AxiosError) => {
            const errorMessage = 'An unexpected error occurred';
            Alert.alert('Error', `Task creation failed: ${errorMessage}`);
            console.error('Task creation error:', error);
        },
    });
};

// Get all tasks
export const useGetMyTasks = () => {
    const setTasks = useTaskStore((state) => state.setTasks);

    return useQuery<TaskType[], AxiosError>({
        queryKey: ['myTasks'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/api/my/task`);
            setTasks(response.data.result);
            return response.data.result;
        },
    });
};

// Delete a task
export const useDeleteMyTask = () => {
    const removeTask = useTaskStore((state) => state.removeTask);

    return useMutation({
        mutationFn: async (taskId: number) => {
            const response = await axios.delete(`${API_BASE_URL}/api/my/task/${taskId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            removeTask(variables);
            Alert.alert('Success', 'Task deleted successfully.');
        },
        onError: (error: AxiosError) => {
            const errorMessage = 'An unexpected error occurred';
            Alert.alert('Error', `Task deletion failed: ${errorMessage}`);
            console.error('Task deletion error:', error);
        },
    });
};