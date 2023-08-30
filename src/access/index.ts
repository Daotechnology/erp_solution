import payload from 'payload';
import { Access } from 'payload/config';
import { checkPermission, extractRoleIds } from '../helper';

export const isAdmin = (access: string = 'create'): Access => async ({ req }) => {
    const { user } = req;
    const { config: { slug: resources } } = req.collection;

    if (!user) {
        return false; // Reject unauthenticated users
    }

    const roleIds = await extractRoleIds(user.id);
    const hasPermission = await checkPermission(roleIds, resources, access);

    if (hasPermission) {
        return true;
    }

};

export const canAccess = (access: string = 'create'): Access => async ({ req }) => {
    const { user } = req;
    const { config: { slug: resources } } = req.collection;

    if (!user) {
        return false; // Reject unauthenticated users
    }

    const roleIds = await extractRoleIds(user.id);
    const hasPermission = await checkPermission(roleIds, resources, access);

    if (hasPermission) {
        return true;
    }

    return {
        id: {
            equals: user.id,
        },
    };

}


export const canRead = (access: string = 'create'): Access => async ({ req }) => {
    const { user } = req;
    // console.log(user);
    const { config: { slug: resources } } = req.collection;

    if (!user) {
        return false; // Reject unauthenticated users
    }

    const roleIds = await extractRoleIds(user.id);
    const hasPermission = await checkPermission(roleIds, resources, access);

    if (hasPermission) {
        return true;
    }

    const ticket = await payload.find({
        collection:resources,
        where:{
            assign_by:{
                equals:user.id
            }
        }
    });

    console.log(ticket.docs);
    return ticket.docs

};
