import payload from 'payload';
import { Access } from 'payload/config';
import { checkPermission } from '../helper';

export const isAdminOrSelf: Access = async ({ req }) => {

    //if the role is an admin give access to create else check permission for the roles

    const user = req.user;
    const resources = req.collection.config.slug;

    // allow authenticated users
    if (user) {        

        //get the roles from payload and collection user Roles
        const rolesDB = await payload.find({
            collection: 'user_roles',
            where: {
                user: {
                    equals: user.id
                }
            }
        });

        // Extract roles from the data
        const rolesArray = rolesDB.docs.map(item => item.roles).flat(); // Use flat() to flatten the nested arrays

        // Extract role_id values
        const roleIds = rolesArray.map(role => role.role_id);

        const permission = checkPermission(roleIds, resources); //if user have the necessary permission it returs true else false

        //Checkk If User is Permitted to 
        //Get Role Id for Admin
        if ( permission ) {
            return true;
        }

        //if any other types of user provide access to themselves
        return {
            id: {
                equals: user.id,
            },
        }
    }

    //reject everyone else
    return false;
};

//   export const canUpdateUser: Access = ({ req: { user }, id }) => {
//     // allow users with a role of 'admin'
//     if (user.roles && user.roles.some(role => role === 'admin')) {
//       return true;
//     }
//     // allow any other users to update only oneself
//     return user.id === id;
//   };