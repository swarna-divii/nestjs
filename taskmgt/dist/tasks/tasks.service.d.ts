import { Task } from './task.model';
export declare class TasksService {
    private tasks;
    getAllTasks(): Task[];
    getTaskById(id: string): Task;
    createTask(title: string, description: string): Task;
}
