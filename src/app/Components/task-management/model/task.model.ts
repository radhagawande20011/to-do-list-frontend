export interface ITask {
    id?: string;
    assignedTo: string;
    status: string;
    dueDate: string;
    priority: string;
    comments: string;
    createdAt?: string;
    updatedAt?: string;
}