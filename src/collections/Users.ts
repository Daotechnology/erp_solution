import { CollectionConfig, CollectionAfterChangeHook } from 'payload/types';
import { isAdmin, canAccess } from '../access';
import payload from 'payload';
import Roles from './Roles';
import { getRolesByUserId } from '../helper';

const Users: CollectionConfig = {
  slug: 'users',

  auth: {
    depth: 0,
  },

  admin: {
    useAsTitle: 'email',
  },

  access: {
    read: () => true, // canAccess('read'), // () => true,
    create: () => true, // isAdmin('create'),
    update: () => true, // canAccess('update'),
    delete: () => true, // canAccess('delete'),
  },

  endpoints: [
    {
      path: "/roles",
      method: "get",
      handler: async (req, res, next) => {
        try {
          const user = req.user;
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          const roles = (await getRolesByUserId(user.id)).flat();

          return res.status(200).send(roles);
        } catch (error) {
          // Handle errors here
          console.error("An error occurred:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
      ,
    },
  ],

  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'company', type: 'text', required: true, saveToJWT: true },
    {
      name: 'password',
      type: 'text',
      required: true
    }
  ],

  hooks: {
    beforeOperation: [async ({ args, operation }) => {
      if (operation == 'create') {

        const roles = args.data.roles;

        const isRoleArray = Array.isArray(roles) ? roles : [roles]; // Ensure roles is an array

        const roleDB = await payload.find({
          collection: 'roles',
        });

        const storedRoles = roleDB.docs.map((role) => role.id); // Extract stored role aliases

        const rolePermission = isRoleArray.every((role: any) => storedRoles.includes(role)); // Check if all role matches

        if (!rolePermission) {
          throw new Error('sorry the roles assigned is not available');
        }

        return args
      }
      return false
    }],

    afterChange: [async ({ doc, req, operation }) => {

      if (operation == 'create' || operation == 'update') {
        const user_id = doc.id;
        const rolesId = Array.isArray(req?.body?.roles) ? req?.body?.roles : [req?.body?.roles]; // Ensure roles is an array

        //transform role to the acceptable database format
        const transformedRole = rolesId?.map((role_id) => ({
          role_id,
        }));

        const assignRolesToUser = await payload.create({
          collection: 'user_roles',
          data: {
            user: user_id,
            roles: transformedRole
          },
        })
        return assignRolesToUser;
      }

      return;

    }],
  }
};

// const afterChangeHook = async() => {
// }

export default Users;