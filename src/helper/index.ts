
import payload from "payload";

interface Permission {
    action: string;
    resource: string;
    // ... other properties
}

export const checkPermission = async (roles: string[], requiredResource: string, action: string): Promise<boolean> => {
    try {
        const rolePermissions = await Promise.all(roles.map(async (role_id) => {
            const rolePermission = await payload.find({
                collection: 'roles_permissions',
                where: {
                    role_id: {
                        equals: role_id
                    }
                }
            });

            // @ts-ignore
            return rolePermission.docs.map(permission => permission.permission_id) as string[];
        }));

        const permissionIds = rolePermissions.flat(2);

        const hasPermission = permissionIds.some(permission => //@ts-ignore
            permission.action === action && permission.resource === requiredResource || permission.action === "*"
        );

        console.log("User has permission:", hasPermission);

        return hasPermission;
    } catch (error) {
        console.error("Error checking permissions:", error);
        return false;
    }
};

export const extractRoleIds = async (userId: string): Promise<string[]> => {
    const rolesDB = await payload.find({
        collection: 'user_roles',
        where: {
            user: {
                equals: userId
            }
        }
    });

    const rolesArray = rolesDB.docs.map(doc => doc.roles);
    const roleIds = rolesArray.map(roles => roles[0].role_id).filter(roleId => roleId !== undefined);

    return roleIds;
};

export const getRolesByUserId = async (id: string) => {
    const userRoles = await payload.find({
        collection: "user_roles",
        where: {
            user: {
                equals: id
            }
        }
    });

    const rolesArray = userRoles.docs.map(doc => doc.roles);
    const roleIds = rolesArray.map(roles => roles[0].role_id).filter(roleId => roleId !== undefined);

    const fetchedRoles = await fetchRoles(roleIds);


    return fetchedRoles;
};

async function fetchRoles(roleIds: string[]) {
    const rolesPromises = roleIds.map(async role_id => {
        const roles = await payload.find({
            collection: "roles",
            where: {
                id: {
                    equals: role_id
                }
            }
        });

        return roles.docs;
    });

    const roles = await Promise.all(rolesPromises);
    return roles;
}

export const isPermission = async (permissions: string[]): Promise<boolean> => {
    const findPermissionResults = await Promise.all(
        permissions.map(async (permission_id) => {
            const permissionDB = await payload.find({
                collection: 'permissions',
                where: {
                    id: { equals: permission_id }
                }
            });

            return permissionDB.totalDocs > 0; // Return true if any permission is found
        })
    );
    return findPermissionResults.some(result => result);
};



export async function generateTicketNumber(data:any): Promise<string> {

    const { ticket_type } = data;
      
    const tickets = await payload.find({
      collection: 'tickets',
    });
    
    const ticketCount = tickets.totalDocs || 0; 
    
    const formattedTicketCount = String(ticketCount + 1).padStart(3, '0');
    
    const ticketNumber = `${ticket_type}${formattedTicketCount}`; // Generate ticket number
    
    return ticketNumber;
  }



