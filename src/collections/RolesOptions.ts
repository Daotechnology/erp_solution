import type { CollectionConfig } from 'payload/types'
import { isAdmin } from '../access/isAdmin';

const RolesOptions: CollectionConfig = {
  slug: 'role_options',
  admin: {
    // useAsTitle: 'title',
    // description: 'Options are managemed here.',
    // group: 'Project'
  },

  access: {
    // create: isAdmin,
    read: () => true,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },

  fields: [
    { name: 'label', type: 'text', required: true, unique: true },
    { name: 'value', type: 'text', required: false, unique: true },
  ],

}

export default RolesOptions;
