import { Request, Response, NextFunction } from 'express';
import TaskService from './task.service';

class Task {

    //fetch all todo task
    async fetchAllTodo(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            if (!user) {
                return res.status(400).json({ error: "Sorry, you do not have access to this resource" });
            }

            const task = await TaskService.getMyTodo(user.id);

            return res.status(200).send(task);
        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //fetch all ongoing task
    async fetchAllOngoing(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = (await TaskService.getAllMyOngoingTask(user.id));

            return res.status(200).send(task);
        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //fetch all task assigned to me
    async fetchAllTaskAssignedToMe(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = (await TaskService.getTaskAssignedToMe(user.id));

            return res.status(200).send(task);
        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //move task from one status to another
    async moveTask(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            const id = req.params.id;
            const acceptedStatus = ['ONGOING', 'COMPLETED'];
            const status = req.body.status.toUpperCase();

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }


            if (!acceptedStatus.includes(status)) {
                const errorMsg = `status must be one of ${acceptedStatus.join(', ')}`;
                return res.status(400).json({ error: errorMsg });
            }

            const task = (await TaskService.moveTask(user.id, id, status));

            return res.status(200).send(task);

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //complete task by id
    async completeTaskById(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            const task_id = req.params.id;

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = (await TaskService.completeTaskById(task_id));

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //fetch all completed task
    async fetchAllCompletedTask(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = (await TaskService.fetchAllCompletedTask(user.id));

            return res.status(200).send(task);

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }


    //fetch all rejected task
    async fetchAllRejectedTask(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = (await TaskService.fetchAllRejectedTask(user.id));

            return res.status(200).send(task);

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //Reject a given task
    async rejectATask(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            const task_id = req.params.id;
            const rejection_reason = req.body.rejection_reason

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = await TaskService.rejectTask(user.id, task_id, rejection_reason);

            return res.status(200).send(task);

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //Reject a given task
    async approveARejectedRequest(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            const request_id = req.params.id;

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = await TaskService.approveRejectRequest(request_id, user.id);

            return res.status(200).send(task);

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //pause a task 
    async pauseATask(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            const task_id = req.params.id;
            console.log(task_id);
            const pause_reason = req.body.reason

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = await TaskService.pauseTask(user.id, task_id, pause_reason);

            return res.status(200).send(task);

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //Approve pause Request
    async approvePauseRequest(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            const request_id = req.params.id;

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = await TaskService.approvePauseRequest(request_id, user.id);

            return res.status(200).send(task);

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

    //fetch all completed task
    async fetchAllPausedTask(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = (await TaskService.fetchAllPausedTask(user.id));

            return res.status(200).send(task);

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

     //pause a task 
     async resumeTask(req: Request, res: Response, next: NextFunction) {
        try {
            //@ts-ignore
            const user = req.user;

            const task_id = req.params.id;

            if (!user) {
                return res.status(400).json({ error: "sorry you do not have access to this resources" });
            }

            const task = await TaskService.resumeTask(user.id, task_id);

            return res.status(200).send(task);

        } catch (error) {
            // Handle errors here
            console.error("An error occurred:", error);
            return res.status(500).json({ error: error.message });
        }
    }

}

export default new Task();