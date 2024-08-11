export type User = {
    userId: number;
    name: string;
    email: string;
    password: string;
};

export type UserDataForm = {
    name: string;
    email: string;
    password: string;
};

export type LoginError = {
    message: string;
}
export type UserLoginType = {
    email: string;
    password: string;
};

export type UpdateUserData = {
    userId?: number;
    name?: string;
    email?: string;
    password?: string;
};

export type TaskType = {
    taskId?: number;
    title: string;
    category: string;
    status: 'Low' | 'Medium' | 'High' | 'pending' | 'in-progress' | 'completed';
};


export type DeleteUserResponse = {
    status: boolean;
    message?: string;
    error?: string;
}
