import type { CollectionConfig } from 'payload/types'

const Permission: CollectionConfig = {
    slug: 'permissions',

    admin: {
        useAsTitle: 'title',
        description: 'Permission are managed here.',
        // group: 'Project'
    },

    access: {
        // create: isAdmin,
        // // Only admins or editors with site access can read
        // read: isAdminOrHasSiteAccess('id'),
        // // Only admins can update
        // update: isAdmin,
        // // Only admins can delete
        // delete: isAdmin,
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
    },

    fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'action', type: 'text', required: true },
        { name: 'description', type: 'text', required: true},
        { name: 'resource', type: 'text', required: true },
    ],

}

export default Permission;
