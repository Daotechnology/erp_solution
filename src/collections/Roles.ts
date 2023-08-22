import type { CollectionAfterChangeHook, CollectionBeforeOperationHook, CollectionConfig } from 'payload/types'
import { isAdmin } from '../access/isAdmin';
import { getOptions } from '../helper/option';
import payload from 'payload';

const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'title',
    description: 'Roles are managemed here.',
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
    {
      name: 'role',
      required: false,
      type: 'text'
    },
    { name: 'roleAlias', type: 'text', required: true, unique: true },
    { name: 'roleDescription', type: 'text', required: false, unique: true },
  ],


  // hooks: {
  //   beforeOperation: [async (args) => {
  //     // console.log(args)
  //     console.log(args.args.req.collection)
  //     const posts = await payload.find({
  //       collection: "role_options",
  //     });
  //     // console.log(posts);
  //   }],
  // }

}

// console.log(option);

export default Roles;
