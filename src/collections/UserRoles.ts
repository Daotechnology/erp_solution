import { CollectionConfig } from 'payload/types';
import { isAdmin, canAccess } from '../access/';

const UserRoles: CollectionConfig = {
    slug: 'user_roles',
    admin: {
        // useAsTitle: 'id',
    },
    access: {
        create: isAdmin('create'),
        read: canAccess('read'),
        update: canAccess('update'),
        delete: canAccess('delete'),
    },
    fields: [
        {
            name: 'roles',
            type: 'array',
            fields: [
              {
                name: 'role_id',
                type: 'text',
              }
            ]
          },
        { name: 'user', type: 'relationship', relationTo: 'users' },

    ],
};

export default UserRoles;
