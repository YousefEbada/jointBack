export interface TaskRepoPort {
    add(taskData: any): Promise<any>;
    remove(taskId: string): Promise<void>;
    update(taskId: string, updateData: any): Promise<any>;
    getAll(userId: string): Promise<any[]>;
}