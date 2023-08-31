import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Tickets from './collections/Tickets';
import { payloadCloud } from '@payloadcms/plugin-cloud';
import UserRoles from './collections/UserRoles';
import Roles from './collections/Roles';
import RolesAndPermission from './collections/RolesAndPermissions';
import Permissions from './collections/Permissions';
import Tasks from './collections/Tasks';
import Reports from './collections/Reports';

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Tickets,
    UserRoles,
    Roles,
    RolesAndPermission,
    Permissions,
    Tasks,
    Reports
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    // payloadCloud()
  ],
  cors: [
    'http://localhost:3000'
  ],
  csrf: [
    'http://localhost:3000'
  ],
});
