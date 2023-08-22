import { Access, FieldAccess } from "payload/types";
import { User } from "../types";

export const isAdmin: Access<any, User> = ({ req: { user } }) => {
  console.log('this is reacjing here ');
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'));
}

export const isAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  console.log('the uck is fucking reaching herre');
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('admin'));
}