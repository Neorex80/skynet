/**
 * Mock user data for testing
 */

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  createdAt: string;
  lastLoginAt?: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  department?: string;
  settings?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    twoFactorEnabled: boolean;
  };
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'admin',
    createdAt: '2023-01-15T08:30:00Z',
    lastLoginAt: '2023-05-20T14:25:10Z',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    status: 'active',
    department: 'Engineering',
    settings: {
      theme: 'dark',
      notifications: true,
      twoFactorEnabled: true
    }
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'manager',
    createdAt: '2023-02-21T10:15:30Z',
    lastLoginAt: '2023-05-19T09:45:22Z',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    status: 'active',
    department: 'Marketing',
    settings: {
      theme: 'light',
      notifications: true,
      twoFactorEnabled: false
    }
  },
  {
    id: '3',
    email: 'robert.johnson@example.com',
    name: 'Robert Johnson',
    role: 'user',
    createdAt: '2023-03-10T15:45:12Z',
    lastLoginAt: '2023-05-18T11:30:45Z',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    status: 'active',
    department: 'Sales',
    settings: {
      theme: 'system',
      notifications: false,
      twoFactorEnabled: false
    }
  },
  {
    id: '4',
    email: 'emily.davis@example.com',
    name: 'Emily Davis',
    role: 'user',
    createdAt: '2023-03-15T09:20:05Z',
    lastLoginAt: '2023-05-15T16:10:30Z',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    status: 'active',
    department: 'Customer Support',
    settings: {
      theme: 'dark',
      notifications: true,
      twoFactorEnabled: false
    }
  },
  {
    id: '5',
    email: 'michael.brown@example.com',
    name: 'Michael Brown',
    role: 'user',
    createdAt: '2023-04-05T14:30:45Z',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    status: 'inactive',
    department: 'Finance',
    settings: {
      theme: 'light',
      notifications: false,
      twoFactorEnabled: false
    }
  },
  {
    id: '6',
    email: 'sarah.wilson@example.com',
    name: 'Sarah Wilson',
    role: 'manager',
    createdAt: '2023-04-12T11:20:15Z',
    lastLoginAt: '2023-05-20T10:45:30Z',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    status: 'active',
    department: 'Human Resources',
    settings: {
      theme: 'system',
      notifications: true,
      twoFactorEnabled: true
    }
  },
  {
    id: '7',
    email: 'david.taylor@example.com',
    name: 'David Taylor',
    role: 'user',
    createdAt: '2023-04-20T08:15:30Z',
    lastLoginAt: '2023-05-19T14:30:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    status: 'active',
    department: 'Engineering',
    settings: {
      theme: 'dark',
      notifications: true,
      twoFactorEnabled: false
    }
  },
  {
    id: '8',
    email: 'jennifer.miller@example.com',
    name: 'Jennifer Miller',
    role: 'user',
    createdAt: '2023-05-01T09:45:20Z',
    lastLoginAt: '2023-05-18T15:20:10Z',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    status: 'active',
    department: 'Marketing',
    settings: {
      theme: 'light',
      notifications: false,
      twoFactorEnabled: false
    }
  },
  {
    id: '9',
    email: 'james.anderson@example.com',
    name: 'James Anderson',
    role: 'user',
    createdAt: '2023-05-10T16:30:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    status: 'suspended',
    department: 'Legal',
    settings: {
      theme: 'system',
      notifications: true,
      twoFactorEnabled: false
    }
  },
  {
    id: '10',
    email: 'lisa.thomas@example.com',
    name: 'Lisa Thomas',
    role: 'user',
    createdAt: '2023-05-15T10:10:10Z',
    lastLoginAt: '2023-05-20T09:30:45Z',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    status: 'active',
    department: 'Product',
    settings: {
      theme: 'dark',
      notifications: true,
      twoFactorEnabled: true
    }
  },
];

export default mockUsers;