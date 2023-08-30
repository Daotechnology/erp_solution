import type { CollectionAfterChangeHook, CollectionConfig } from 'payload/types'
import { canAccess, canRead, isAdmin } from '../access';
import payload from 'payload';
import { generateTicketNumber } from '../helper';
import { updateDocumentInCollection } from '../helper/model.helper';

const AfterChangeHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  previousDoc,
  operation,
}) => {
  if (operation === 'create') {

    const ticket_no = await generateTicketNumber(doc);
    const company = req.user.company;
    const assign_by = req.user.id;
  
    const updatedDoc = await updateDocumentInCollection('tickets', doc.id, {
      ticket_no,
      company,
      assign_by
    })
    return updatedDoc;
  }
};



const Ticket: CollectionConfig = {
  slug: 'tickets',
  admin: {
    useAsTitle: 'title',
    description: 'Project  are managemed here.',
    // group: 'Project'
  },

  access: {
    create:()=>true,
    // create: isAdmin('create'),
    read: canRead('read'),
    update: canAccess('update'),
    delete: canAccess('delete'),
  },

  fields: [
    { name: 'title', type: 'text', required: false },
    {
      name: 'assign_to',
      type: 'relationship', // Assuming users are related to the collection
      relationTo: 'users',
      hasMany: false,
      required: false
    },
    {
      name: "reporters_name",
      type: "text",
      required: false
    },
    {
      name: "reporters_email",
      type: "text",
      required: false
    },
    {
      name: "reporters_number",
      type: "text",
      required: false
    },
    {
      name: "email_address",
      type: "text",
      required: false
    },

    {
      name: "project",
      type: "text",
      required: false
    },

    { name: 'incident_type', type: 'text', required: false },
    { name: 'priority', type: 'text', required: false },
    {
      name: 'assign_by',
      type: 'relationship',
      relationTo:'users',
      required: false,
    },
    { name: 'company', type: 'text', required: false },
    { name: 'ticket_type', defaultValue: 'Helpdesk', type: 'text', required: false },
    { name: 'ticket_no', type: 'text', required: false },
    { name: 'start_date', type: 'text', required: false },
    { name: 'end_date', type: 'text', required: false },
    { name: 'overview', type: 'text', required: false },
  ],
  hooks: {
    afterChange: [AfterChangeHook]
  }
}



export default Ticket;
