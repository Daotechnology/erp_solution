import type { CollectionAfterChangeHook, CollectionConfig } from 'payload/types'
import { verifyTicket } from '../helper';
import { updateDocumentInCollection } from '../helper/model.helper';
import Task from '../module/Task/task.controller';
import {  taskRoutes } from './../module/Task/task.router';

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

  endpoints: taskRoutes,

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
    { name: 'status', type: 'text', required: false, defaultValue: "PENDING" },
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
