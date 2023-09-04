import type { CollectionConfig } from 'payload/types'
import { fetchAllRequestByRequestType } from '../helper';

const Requests: CollectionConfig = {
    slug: 'requests',
    admin: {
        useAsTitle: 'title',
        description: 'Requests are managemed here.',
        // group: 'Project'
    },

    access: {
        read: () => true, // canAccess('read'), // () => true,
        create: () => true, // isAdmin('create'),
        update: () => true, // canAccess('update'),
        delete: () => true, // canAccess('delete'),
    },

    endpoints: [
        {
            path: "/reject/:request_type",
            method: "get",
            handler: async (req, res, next) => {
                try {
                    const user = req.user;
                    const request_type = req.params.request_type || 'REJECTION';

                    if (!user) {
                        return res.status(404).json({ error: "sorry you do not have access to this resources" });
                    }

                    const project = (await fetchAllRequestByRequestType(user.id,request_type));

                    return res.status(200).send(project);
                } catch (error) {
                    // Handle errors here
                    console.error("An error occurred:", error);
                    return res.status(500).json({ error: error.message });
                }
            },
        }
    ],

    fields: [
        {
            name: 'task_id',
            type: 'relationship', // Assuming users are related to the collection
            relationTo: 'tasks',
            required: true
        },
        { name: 'request_type', type: 'text', required: true, unique: true },
        {
            name: 'assign_to', 
            type: 'relationship', // Assuming users are related to the collection
            relationTo: 'users',
            required: true
        },
        {
            name: 'assign_by',
            type: 'relationship', // Assuming users are related to the collection
            relationTo: 'users',
            required: true
        },
        { name: 'reason', type: 'text', required: true },
    ],
}

export default Requests;
