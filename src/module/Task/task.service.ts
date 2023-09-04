import payload from "payload";
import { checkAuthorization, getTaskById } from "./task.helper";
import eventEmitter from "./task.event";
class Task {

    async getMyTodo(user: string): Promise<any> {

        const tasks = await payload.find({
            collection: 'tasks',
            where: {
                and: [
                    {
                        assign_by: {
                            equals: user
                        }
                    }, {
                        and: [
                            {
                                status: {
                                    equals: 'PENDING'
                                }
                            }
                        ]
                    }
                ],
            }
        });

        return tasks;
    }

    async getAllMyOngoingTask(user: string): Promise<any> {

        const tasks = await payload.find({
            collection: 'tasks',
            where: {
                or: [
                    {
                        assign_by: {
                            equals: user
                        }
                    },
                    {
                        assign_to: {
                            equals: user
                        }
                    }
                ],
                and: [
                    {
                        status: {
                            equals: 'ONGOING'
                        }
                    }
                ]
            }
        });

        return tasks;
    }

    async getTaskAssignedToMe(user: string): Promise<any> {

        const tasks = await payload.find({
            collection: 'tasks',
            where: {
                and: [
                    {
                        assign_to: {
                            equals: user
                        }
                    }, {
                        and: [
                            {
                                status: {
                                    equals: 'PENDING'
                                }
                            }
                        ]
                    }
                ],
            }
        });

        return tasks;
    }

    async moveTask(user: string, task_id: string, status: string): Promise<any> {

        const tasks = await getTaskById(task_id);

        await checkAuthorization(user, tasks);

        const updatedTask = await payload.update({
            collection: 'tasks',
            id: task_id,
            data: {
                status
            }
        });

        return updatedTask;
    }

    async completeTaskById(task_id: string): Promise<any> {

        const tasks = await payload.update({
            collection: 'tasks',
            id: task_id,
            data: {
                status: "COMPLETED"
            }
        });

        return tasks;
    }

    async fetchAllCompletedTask(user: string): Promise<any> {

        const tasks = await payload.find({
            collection: 'tasks',
            where: {
                or: [
                    {
                        assign_by: {
                            equals: user
                        }
                    },
                    {
                        assign_to: {
                            equals: user
                        }
                    },
                    {
                        and: [
                            {
                                status: {
                                    equals: 'COMPLETED'
                                }
                            }
                        ]
                    }
                ],
            }
        });

        return tasks;
    }

    async fetchAllRejectedTask(user: string): Promise<any> {

        const tasks = await payload.find({
            collection: 'tasks',
            where: {
                and: [
                    {
                        assign_to: {
                            equals: user
                        }
                    }, {
                        and: [
                            {
                                status: {
                                    equals: 'REJECTED'
                                }
                            }
                        ]
                    }
                ],
            }
        });

        return tasks;
    }

    async rejectTask(user: string, task_id: string, rejection_reason: string): Promise<any> {

        const tasks = await payload.find({
            collection: 'tasks',
            where: {
                id: {
                    equals: task_id
                }
            }
        });

        //check if you are the one that assigned the task
        const assign_by = tasks.docs[0].assign_by.id;
        const assign_to = tasks.docs[0].assign_to.id;

        if (user == assign_by) {
            // throw new Error('sorry you cannot reject a task you created');
        }

        //check if task is associated wth you 
        if (assign_to !== user) {
            throw new Error('sorry you cannot reject a task not assigned to you');
        }

        //create a Rejection Request
        const data = {
            task_id,
            assign_to,
            assign_by,
            reason: rejection_reason,
            request_type: 'REJECTION'
        }

        const request = await payload.create({
            collection: "requests", // required
            data
        });

        return request;
    }

    async approveRejectRequest(request: string, user: string): Promise<any> {

        const requests = await payload.find({
            collection: 'requests',
            where: {
                id: {
                    equals: request
                }
            }
        });

        const task_id = requests.docs[0].task_id.id;

        const assign_by = requests.docs[0].assign_by.id;
        if (assign_by !== user) {
            throw new Error('sorry you are not authorized to approved this request');
        }

        //get task by its task id

        const task = await payload.update({
            collection: "tasks",
            id: task_id,
            data: {
                status: "REJECTED"
            }
        });

        //call the delete request event handler
        eventEmitter.emit('deleteRequest', request);

        return task;
    }

    async pauseTask(user: string, task_id: string, pause_reason: string): Promise<any> {

        const tasks = await payload.find({
            collection: 'tasks',
            where: {
                id: {
                    equals: task_id
                }
            }
        });

        //check if you are the one that assigned the task
        const assign_by = tasks?.docs[0]?.assign_by?.id ?? null;
        const assign_to = tasks?.docs[0]?.assign_to?.id ?? null;

        if (assign_by !== null && user == assign_by) {
            // throw new Error('sorry you cannot pause a task you created');
        }

        //check if task is associated wth you 
        if (assign_to !== user) {
            throw new Error('sorry you cannot reject a task not assigned to you');
        }

        //create a Pause Request
        const data = {
            task_id,
            assign_to,
            assign_by,
            reason: pause_reason,
            request_type: 'PAUSED'
        }

        const request = await payload.create({
            collection: "requests", // required
            data
        });

        return request;
    }

    async approvePauseRequest(request: string, user: string): Promise<any> {

        const requests = await payload.find({
            collection: 'requests',
            where: {
                id: {
                    equals: request
                }
            }
        });

        const task_id = requests?.docs[0]?.task_id?.id ?? null;

        const assign_by = requests?.docs[0]?.assign_by.id ?? null;

        if (assign_by !== user || assign_by == null) {
            throw new Error('sorry you are not authorized to approved this request');
        }

        //get task by its task id

        const task = await payload.update({
            collection: "tasks",
            id: task_id,
            data: {
                status: "PAUSED"
            }
        });

        //call the delete request event handler
        eventEmitter.emit('deleteRequest', request);

        //return task
        return task;
    }

    async fetchAllPausedTask(user: string): Promise<any> {

        const tasks = await payload.find({
            collection: 'tasks',
            where: {
                and: [
                    {
                        assign_to: {
                            equals: user
                        }
                    }, {
                        and: [
                            {
                                status: {
                                    equals: 'PAUSED'
                                }
                            }
                        ]
                    }
                ],
            }
        });

        return tasks;
    }

    async resumeTask(user: string, task_id: string): Promise<any> {

        const tasks = await payload.find({
            collection: 'tasks',
            where: {
                id: {
                    equals: task_id
                }
            }
        });

        //check if you are the one assigned the task to
        const assign_to = tasks?.docs[0]?.assign_to?.id ?? null;

        //check if task is associated wth you 
        if (assign_to !== user) {
            throw new Error('sorry you cannot reject a task not assigned to you');
        }

        //create a Pause Request
        const data = {
            status: 'ONGOING'
        }

        const task = await payload.update({
            collection: "tasks",
            id: task_id,
            data
        });

        return task;
    }


}

export default new Task();