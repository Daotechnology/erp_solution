import payload from "payload";
require('dotenv').config();


export async function getOptions() {
    // Fetch roles from your API endpoint
    const response = await fetch(`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/role_options`);
    const roles = await response.json();

    console.log(roles);
    // Map roles to options format
    return roles.docs.map((role:any) => ({
      label: role.label,
      value: role.value,
    }));
  }