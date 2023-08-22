import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';

const UserRoles: CollectionConfig = {
    slug: 'user_roles',
    admin: {
        // useAsTitle: 'id',
    },
    access: {
        create: isAdmin,
        read: isAdmin,
        update: isAdmin,
        delete: isAdmin,
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
