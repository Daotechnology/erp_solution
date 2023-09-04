import { Endpoint } from 'payload/config';
import Task from './task.controller';

// Define a custom route type
type CustomRoute = Omit<Endpoint, "root">;

export const taskRoutes: CustomRoute[] = [
  {
    path: "/todo",
    method: "get",
    handler: Task.fetchAllTodo
  },
  {
    path: "/ongoing",
    method: "get",
    handler: Task.fetchAllOngoing
  },
  {
    path: "/assigned",
    method: "patch",
    handler: Task.fetchAllTaskAssignedToMe
  },
  {
    path: "/move/:id",
    method: "patch",
    handler: Task.moveTask
  },
  {
    path: "/complete/:id",
    method: "get",
    handler: Task.completeTaskById
  },
  {
    path: "/complete",
    method: "get",
    handler: Task.fetchAllCompletedTask
  },
  {
    path: "/reject",
    method: "get",
    handler: Task.fetchAllRejectedTask
  },
  {
    path: "/reject/:id",
    method: "patch",
    handler: Task.rejectATask
  },
  {
    path: "/reject/:id",
    method: "put",
    handler: Task.approveARejectedRequest
  },
  {
    path: "/reject/all",
    method: "get",
    handler: Task.fetchAllRejectedTask
  },
  {
    path: "/pause/:id",
    method: "patch",
    handler: Task.pauseATask
  },
  {
    path: "/approve/pause/:id",
    method: "patch",
    handler: Task.approvePauseRequest
  },
  {
    path: "/pause/request",
    method: "get",
    handler: Task.approvePauseRequest
  },
  {
    path: "/pause",
    method: "get",
    handler: Task.fetchAllPausedTask
  },
  {
    path: "/resume/:id",
    method: "patch",
    handler: Task.resumeTask
  },
];