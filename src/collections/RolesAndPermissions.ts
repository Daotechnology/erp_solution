import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrSelf } from '../access/isAdminOrSelf';

const RolesAndPermission: CollectionConfig = {
  slug: 'roles_permissions',
  admin: {
    useAsTitle: 'id',
  },

  access: {
    create: isAdminOrSelf,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },

  fields: [
    { name: 'permission_id', type: 'relationship', hasMany: true, relationTo: 'permissions' },
    { name: 'role_id', type: 'relationship', relationTo: 'roles' },
  ],
};

export default RolesAndPermission;
