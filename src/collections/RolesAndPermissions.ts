import { CollectionConfig } from 'payload/types';
import { canAccess, isAdmin } from '../access';
import { isPermission } from '../helper';

const RolesAndPermission: CollectionConfig = {
  slug: 'roles_permissions',
  admin: {
    useAsTitle: 'id',
  },

  access: {
    create: isAdmin('create'),
    read: canAccess('read'),
    update: canAccess('update'),
    delete: canAccess('delete'),
  },

  fields: [
    { 
      name: 'permission_id',
      type: 'relationship', 
      validate: async (val, { operation }) => {
        if (operation === 'create') {
            const isPermissionValid = await isPermission(val);
            if (!isPermissionValid) {
                throw new Error("sorry one or many permission ids are incorrect");
            }
        }
        return val;
    },    
      hasMany: true,
      relationTo: 'permissions'
    },
    { 
      name: 'role_id', 
      type: 'relationship',
      //  validate: async (val, { operation }) => {
      //     if (operation === 'create') {
      //         const isPermissionValid = await isPermission(val);
      //         if (!isPermissionValid) {
      //             throw new Error("sorry one or many permission ids are incorrect");
      //         }
      //     }
      //     return val;
      // },  
      relationTo: 'roles' 
    },
  ],
};

export default RolesAndPermission;
