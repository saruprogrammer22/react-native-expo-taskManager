// RenderTaskItem.tsx
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TaskType } from '../types/types';

interface RenderTaskItemProps {
    tasks: TaskType[];
    onDelete: (taskId: number) => void;
}

const RenderTaskItem: React.FC<RenderTaskItemProps> = ({ tasks, onDelete }) => {

    const getStatusColor = (status: TaskType['status']) => {
        switch (status) {
            case 'Low':
                return '#6c757d'; // grey
            case 'Medium':
                return '#ffc107'; // Yellow
            case 'High':
                return '#dc3545'; // Red
            case 'pending':
                return '#17a2b8'; // Cyan
            case 'in-progress':
                return '#fd7e14'; // Orange
            case 'completed':
                return '#28a745'; // green
            default:
                return '#007bff'; // Default Blue
        }
    };

    if (tasks.length === 0) {
        return <Text>No Task found</Text>
    }

    return (
        <View style={styles.container}>
            {tasks.map((task, i) => (
                <View key={i} style={styles.taskContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{task.title}</Text>
                        <Text style={styles.description}>Category: {task.category}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
                            <Text style={styles.statusText}>{task.status}</Text>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => onDelete(task.taskId!)}>
                            <AntDesign name="delete" size={24} color="#dc3545" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#f4f4f4',
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#007bff',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: 5,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        marginLeft: 15,
        padding: 8,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
});

export default RenderTaskItem;
