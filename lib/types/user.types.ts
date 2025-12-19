/**
 * User Type Definitions
 * 
 * Type definitions for user accounts and authentication.
 */

/**
 * User roles
 */
export type UserRole = 'USER' | 'ADMIN';

/**
 * User account
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
}

/**
 * User form data
 */
export interface UserFormData {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}
