import payload from "payload";

export async function getTaskById(taskId: string): Promise<any> {
    const tasks = await payload.find({
        collection: 'tasks',
        where: {
            id: {
                equals: taskId
            }
        }
    });
    return tasks.docs[0];
}

export async function checkAuthorization(user: string, task: any): Promise<void> {
    const currentStatus = task?.status;

    if (!currentStatus) {
        throw new Error('Sorry, you are not authorized to move this task.');
    }

    if (currentStatus === 'COMPLETED' || currentStatus === 'REJECTED') {
        throw new Error('Sorry, you cannot change the status of a completed or rejected task.');
    }

    if (task?.assign_by?.id !== user && task?.assign_to?.id !== user) {
        throw new Error('Sorry, you cannot change the status of a task not assigned to you.');
    }
}
