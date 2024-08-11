import { create } from 'zustand';


type TaskResult = {
    id: number | null;
    message: string | null;
}

interface TaskState {
    id: number | null;
    title: string | null;
    category: string | null;
    status: string | null;
    result: TaskResult | null;
    allTaskResult: TaskResult | null;
    addTask: (status: string, result: TaskResult) => void;
    getAllTask: (status: string, result: TaskResult) => void;
    clearUser: () => void;
}

// Create the Zustand store
const useTaskStore = create<TaskState>((set) => ({
    id: null,
    title: null,
    category: null,
    status: null,
    result: null,
    allTaskResult: null,
    addTask: (status, result) => set({ status, result }),
    getAllTask: (status, allTaskResult) => set({ status, allTaskResult }),
    clearUser: () => set({ id: null, title: null, category: null, status: null }),
}));


export default useTaskStore;
