import type { CollectionAfterChangeHook, CollectionConfig } from 'payload/types'
import { getAllProjectCreatedByMe } from '../helper';
import { updateDocumentInCollection } from '../helper/model.helper';

const AfterChangeHook: CollectionAfterChangeHook = async ({
    doc,
    req,
    previousDoc,
    operation,
}) => {
    if (operation === 'create') {

        if (!req.user) {
            throw new Error('you do not have access to this resources');
        }

        const assign_by = req.user.id || null;
        const company = req.user.company || null;

        const updatedDoc = await updateDocumentInCollection('projects', doc.id, {
            company,
            assign_by
        });
        
        return updatedDoc;
    }
};

const Projects: CollectionConfig = {
    slug: 'projects',
    admin: {
        useAsTitle: 'title',
        description: 'Projects are managemed here.',
    },

    access: {
        read: () => true, // canAccess('read'), // () => true,
        create: () => true, // isAdmin('create'),
        update: () => true, // canAccess('update'),
        delete: () => true, // canAccess('delete'),
    },

    endpoints: [
        {
            path: "/read",
            method: "get",
            handler: async (req, res, next) => {
                try {
                    const user = req.user;

                    if (!user) {
                        return res.status(400).json({ error: "sorry you cannot access this resurces because you are not authenticated" });
                    }

                    const project = await getAllProjectCreatedByMe(user.id);

                    return res.status(200).send(project);
                } catch (error) {
                    // Handle errors here
                    console.error("An error occurred:", error);
                    return res.status(500).json({ error: error.message });
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

        { name: 'customer_name', type: 'text', required: true },
        { name: 'po_award_date', type: 'text', required: true },
        { name: 'order_summary', type: 'text', required: true },
        { name: 'isdemo', type: 'text', required: true },
        { name: 'site_survey', type: 'text', required: true },
        { name: 'solution_document', type: 'text', required: true },
        { name: 'file', type: 'text', required: false}
    ],

    hooks: {
        afterChange: [AfterChangeHook]
    }

}

export default Projects;
