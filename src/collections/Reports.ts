import type { CollectionAfterChangeHook, CollectionBeforeOperationHook, CollectionConfig } from 'payload/types'
import { canAccess, isAdmin } from '../access';
import payload from 'payload';
import { getReportByTaskId, getTaskAssignedToMe, getTaskCreatedByMe, verifyTask, verifyTicket } from '../helper';
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

        const updatedDoc = await updateDocumentInCollection('reports', doc.id, {
            company,
            assign_by
        })
        return updatedDoc;
    }
};

const Reports: CollectionConfig = {
    slug: 'reports',
    admin: {
        useAsTitle: 'title',
        description: 'Reports are managemed here.',
    },

    access: {
        read: () => true, // canAccess('read'), // () => true,
        create: () => true, // isAdmin('create'),
        update: () => true, // canAccess('update'),
        delete: () => true, // canAccess('delete'),
    },

    endpoints: [
        {
            path: "/:task_id",
            method: "get",
            handler: async (req, res, next) => {
                try {
                    const user = req.user;
                    const task_id = req.params.task_id;

                    if (!user) {
                        return res.status(404).json({ error: "sorry you do not have access to this resources" });
                    }

                    const task = (await getReportByTaskId(user.id, task_id));

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
            method: "get",
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
        }
    ],

    fields: [
        {
            name: 'assign_by',
            type: 'relationship', // Assuming users are related to the collection
            relationTo: 'users',
            required: false
        },

        { name: 'reports', type: 'text', required: true },
        { name: 'completion_rate', type: 'text', required: true },
        {
            name: 'task_id',
            type: 'relationship',
            relationTo: "tasks",
            validate: async (val, { operation }) => {
                if (operation === 'create' || operation == 'update') {
                    try {
                        const task = await verifyTask(val);
                        if (task) {
                            return true;
                        } else {
                            throw new Error('Task verification failed');
                        }
                    } catch (error) {
                        throw new Error('Error verifying task: ' + error.message);
                    }
                }
                return val;
            },
            required: true
        },
    ],

    hooks: {
        afterChange: [AfterChangeHook]
    }

}

export default Reports;
