import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Alert } from "react-native";
import { TaskType } from "../../types/types";
import useTaskStore from "../store/taskStore";

const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.0.102:8088';

export const useCreateTask = () => {
    const addTask = useTaskStore((state) => state.addTask);

    return useMutation({
        mutationFn: async (data: TaskType) => {
            const response = await axios.post(`${API_BASE_URL}/api/my/task/`, data);
            return response.data;
        },
        onSuccess: (data) => {
            addTask(data.status, data.result);
            Alert.alert('Task Created', 'The task has been created successfully!');
            console.log('Task created successfully:', data);
        },
        onError: (error) => {
            let errorMessage = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            Alert.alert('Task Creation Failed', errorMessage);
            console.error('Task creation error:', error);
        },
    });
};

export const useGetMyTasks = () => {
    const getAllTask = useTaskStore((state) => state.getAllTask);

    return useQuery<TaskType[], AxiosError>({
        queryKey: ['myTasks'],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/api/my/task`);
            getAllTask(response.data.status, response.data.result);
            return response.data.result;
        },
    });
};

export const useDeleteMyTask = () => {
    return useMutation({
        mutationFn: async (taskId: number) => {
            const response = await axios.delete(`${API_BASE_URL}/api/my/task/${taskId}`);
            return response.data;
        },
        onSuccess: (data) => {
            Alert.alert('Task Deleted', data.message || 'The task has been deleted successfully.');
            console.log('Task deleted successfully:', data);
        },
        onError: (error) => {
            let errorMessage = 'An unexpected error occurred';
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            Alert.alert('Task Deletion Failed', errorMessage);
            console.error('Task deletion error:', error);
        },
    });
};
