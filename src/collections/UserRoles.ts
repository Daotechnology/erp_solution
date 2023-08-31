import { CollectionConfig } from 'payload/types';
import { isAdmin, canAccess } from '../access/';

const UserRoles: CollectionConfig = {
  slug: 'user_roles',
  admin: {
    // useAsTitle: 'id',
  },
  access: {
    read: () => true, // canAccess('read'), // () => true,
    create: () => true, // isAdmin('create'),
    update: () => true, // canAccess('update'),
    delete: () => true, // canAccess('delete'),
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
