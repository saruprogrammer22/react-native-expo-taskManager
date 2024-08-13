import { create } from 'zustand';
import { TaskType } from '../../types/types';

interface TaskState {
    tasks: TaskType[];
    addTask: (task: TaskType) => void;
    setTasks: (tasks: TaskType[]) => void;
    removeTask: (id: number) => void;
}

const useTaskStore = create<TaskState>((set) => ({
    tasks: [],
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    setTasks: (tasks) => set({ tasks }),
    removeTask: (id) => set((state) => ({ tasks: state.tasks.filter(task => task.taskId !== id) })),
}));

export default useTaskStore;
