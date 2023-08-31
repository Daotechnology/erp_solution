import type { CollectionConfig } from 'payload/types'
import { canAccess, isAdmin } from '../access';


const Permission: CollectionConfig = {
    slug: 'permissions',

    admin: {
        useAsTitle: 'title',
        description: 'Permission are managed here.',
        // group: 'Project'
    },

    access: {
        read: () => true, // canAccess('read'), // () => true,
        create: () => true, // isAdmin('create'),
        update: () => true, // canAccess('update'),
        delete: () => true, // canAccess('delete'),
    },

    fields: [
        { name: 'name', type: 'text', required: true, unique: true },
        { name: 'action', type: 'text', required: true, unique: true },
        { name: 'description', type: 'text', required: true, unique: true },
        { name: 'resource', type: 'text', required: true, unique: true },
    ],

}

export default Permission;
