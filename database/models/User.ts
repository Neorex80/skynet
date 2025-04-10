/**
 * User model definition
 */

import { Entity } from '../../src/types/database';

export interface User extends Entity {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  twoFactorEnabled: boolean;
  emailDigestFrequency: 'daily' | 'weekly' | 'never';
  language: string;
}

export const userColumns = {
  id: 'id',
  email: 'email',
  name: 'name',
  role: 'role',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  lastLoginAt: 'last_login_at',
  avatarUrl: 'avatar_url',
  status: 'status',
  department: 'department',
  preferences: 'preferences'
};

export const userTable = 'users';

/**
 * Create a new User object with default values
 */
export function createUser(data: Partial<User>): User {
  const now = new Date().toISOString();
  
  return {
    id: crypto.randomUUID(),
    email: '',
    name: '',
    role: 'user',
    status: 'active',
    createdAt: now,
    updatedAt: now,
    preferences: {
      theme: 'system',
      notifications: true,
      twoFactorEnabled: false,
      emailDigestFrequency: 'weekly',
      language: 'en'
    },
    ...data
  };
}

export default User;