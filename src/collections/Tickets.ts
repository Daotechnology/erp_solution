import type { CollectionConfig } from 'payload/types'
import { CollectionBeforeValidateHook } from "payload/types";
import { isAdminOrSelf } from '../access/isAdminOrSelf';



const Ticket: CollectionConfig = {
  slug: 'tickets',
  admin: {
    useAsTitle: 'title',
    description: 'Project  are managemed here.',
    // group: 'Project'
  },

  access: {
    create: isAdminOrSelf,
    // // Only admins or editors with site access can read
    // read: isAdminOrHasSiteAccess('id'),
    // // Only admins can update
    // update: isAdmin,
    // // Only admins can delete
    // delete: isAdmin,
    // read: () => true,
    // update: () => true,
    // delete: () => true,
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'assigned_to',
      type: 'relationship', // Assuming users are related to the collection
      relationTo: 'users',
      hasMany: true,
      required: false
    },
    { name: 'incident_type', type: 'text', required: true },
    { name: 'priority', type: 'text', required: true },
    {
      name: 'assign_by',
      type: 'text',
      required: false,
    },
    { name: 'company', type: 'text', required: true },
    { name: 'ticket_type', defaultValue: 'Helpdesk', type: 'text', required: true },
    { name: 'ticket_no', type: 'text', required: false },
    { name: 'start_date', type: 'text', required: true },
    { name: 'end_date', type: 'text', required: true },
    { name: 'overview', type: 'text', required: true },
  ],
}

const beforeValidateHook: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation === 'create') {
    console.log(req.user);
    const { ticket_type } = data;
    const ticketCount = await req.user.find('Ticket', { ticket_type });

    // Format ticketCount
    const formattedTicketCount = String(ticketCount + 1).padStart(3, '0');

    const ticketNumber = `${ticket_type}${formattedTicketCount}`; // Generate ticket number
    data.ticket_no = ticketNumber;
    await data.save();
    return data;
  }
};

export default Ticket;
