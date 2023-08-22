import { CollectionConfig, CollectionAfterChangeHook } from 'payload/types';
import { isAdminOrSelf } from '../access/isAdminOrSelf';
import { isAdmin, isAdminFieldLevel } from '../access/isAdmin';
import payload from 'payload';
import Roles from './Roles';

// import bcrypt from 'bcrypt';

// async function hashPassword(plainTextPassword: string): Promise<string> {
//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
//   return hashedPassword;
// }

// async function comparePasswords(
//   userProvidedPassword: string,
//   hashedPassword: string
// ): Promise<boolean> {
//   const passwordsMatch = await bcrypt.compare(userProvidedPassword, hashedPassword);
//   return passwordsMatch;
// }

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 0,
  },
  // admin: {
  //   useAsTitle: 'email',
  // },
  access: {
    // Only admins can create users
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true
    // create: isAdmin,
    // Admins can read all, but any other logged in user can only read themselves
    // read: isAdminOrSelf,
    // Admins can update all, but any other logged in user can only update themselves
    // update: isAdminOrSelf,
    // Only admins can delete
    // delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'company', type: 'text', required: true },
    {
      name: 'password',
      type: 'text',
      // validate: async (val, { operation }) => {
      //   console.log(val);
      //   if (operation == 'create' || operation == 'update') {
      //     const hash_password = await hashPassword(val);
      //     return hash_password;
      //   }
      //   return val;
      // },
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

        const storedRoles = roleDB.docs.map((role) => role.roleAlias); // Extract stored role aliases

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
        const roles = Array.isArray(req?.body?.roles) ? req?.body?.roles : [req?.body?.roles]; // Ensure roles is an array

        const roleDB = await payload.find({
          collection: 'roles',
        });

        // Find roles that exist in the database and get their corresponding IDs
        const rolesWithIDs = roleDB?.docs?.filter((role) => roles.includes(role.roleAlias));

        const rolesId = rolesWithIDs?.map((role) => role.id);

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
        return;
      }
      return 
    }],
  }
};

// const afterChangeHook = async() => {
// }

export default Users;