import payload from 'payload';
import { Access } from 'payload/config';
import { checkPermission, extractRoleIds } from '../helper';

export const isAdmin = (access: string): Access => async ({ req }) => {
    const { user } = req;
    const { config: { slug: resources } } = req.collection;

    console.log(user.id);
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
