import type { CollectionAfterChangeHook, CollectionBeforeOperationHook, CollectionConfig } from 'payload/types'
import { canAccess, isAdmin } from '../access';
import payload from 'payload';
import { completeTaskById, fetchAllCompletedTask, getTaskAssignedToMe, getTaskCreatedByMe, verifyTicket } from '../helper';
import { updateDocumentInCollection } from '../helper/model.helper';

const AfterChangeHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  previousDoc,
  operation,
}) => {
  if (operation === 'create') {

    const assign_by = req.user.id;
    const company = req.user.company;

    const updatedDoc = await updateDocumentInCollection('tasks', doc.id, {
      company,
      assign_by
    })
    return updatedDoc;
  }
};

const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    description: 'Tasks are managemed here.',
  },

  access: {
    read: () => true, // canAccess('read'), // () => true,
    create: () => true, // isAdmin('create'),
    update: () => true, // canAccess('update'),
    delete: () => true, // canAccess('delete'),
  },

  endpoints: [
    {
      path: "/me",
      method: "get",
      handler: async (req, res, next) => {
        try {
          const user = req.user;

          if (!user) {
            return res.status(404).json({ error: "sorry you do not have access to this resources" });
          }

          const task = (await getTaskCreatedByMe(user.id));

          return res.status(200).send(task);
        } catch (error) {
          // Handle errors here
          console.error("An error occurred:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
      ,
    },
    {
      path: "/assigned",
      method: "patch",
      handler: async (req, res, next) => {
        try {
          const user = req.user;

          if (!user) {
            return res.status(404).json({ error: "sorry you do not have access to this resources" });
          }

          const task = (await getTaskAssignedToMe(user.id));

          return res.status(200).send(task);
        } catch (error) {
          // Handle errors here
          console.error("An error occurred:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
      ,
    },
    {
      path: "/complete/:id",
      method: "get",
      handler: async (req, res, next) => {
        try {
          const user = req.user;
          const task_id = req.params.id;

          if (!user) {
            return res.status(404).json({ error: "sorry you do not have access to this resources" });
          }

          const task = (await completeTaskById(task_id));

          return res.status(200).send(task);
        } catch (error) {
          // Handle errors here
          console.error("An error occurred:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
      ,
    },
    {
      path: "/complete",
      method: "get",
      handler: async (req, res, next) => {
        try {
          const user = req.user;

          if (!user) {
            return res.status(404).json({ error: "sorry you do not have access to this resources" });
          }

          const task = (await fetchAllCompletedTask(user.id));

          return res.status(200).send(task);
        } catch (error) {
          // Handle errors here
          console.error("An error occurred:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
      ,
    },
    {
      path: "/reject",
      method: "get",
      handler: async (req, res, next) => {
        try {
          const user = req.user;

          if (!user) {
            return res.status(404).json({ error: "sorry you do not have access to this resources" });
          }

          const task = (await fetchAllCompletedTask(user.id));

          return res.status(200).send(task);
        } catch (error) {
          // Handle errors here
          console.error("An error occurred:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
      ,
    }
  ],

  fields: [
    {
      name: 'task_name',
      required: true,
      type: 'text'
    },
    {
      name: 'assign_to',
      type: 'relationship', // Assuming users are related to the collection
      relationTo: 'users',
      required: false
    },
    {
      name: 'assign_by',
      type: 'relationship', // Assuming users are related to the collection
      relationTo: 'users',
      required: false
    },

    { name: 'milestone', type: 'text', required: true, },
    { name: 'start_date', type: 'text', required: false },
    { name: 'end_date', type: 'text', required: false },
    { name: 'priority', type: 'text', required: false },
    { name: 'status', type: 'text', required: false, defaultValue: "creation" },
    {
      name: 'ticket_id',
      type: 'relationship',
      relationTo: "tickets",
      validate: async (val, { operation }) => {
        if (operation === 'create' || operation == 'update') {
          try {
            const ticket = await verifyTicket(val);
            if (ticket) {
              return true;
            } else {
              throw new Error('Ticket verification failed');
            }
          } catch (error) {
            throw new Error('Error verifying ticket: ' + error.message);
          }
        }
        return val;
      },
      required: false
    },
  ],

  hooks: {
    afterChange: [AfterChangeHook]
  }

}

export default Tasks;
