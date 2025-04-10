/**
 * Database types
 * These types define the interface for database operations
 */

// Database types supported by the application
export type DatabaseType = 'supabase' | 'sqlite' | 'postgres';

// Configuration for database connection
export interface DatabaseConfig {
  type: DatabaseType;
  url?: string;
  key?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  path?: string;
  options?: Record<string, any>;
}

// Options for query execution
export interface QueryOptions {
  timeout?: number;
  cache?: boolean;
  cacheKey?: string;
  cacheExpiry?: number;
}

// Query result interface
export interface QueryResult<T = any> {
  data: T[];
  rowCount: number;
  metadata: Record<string, any>;
}

// Database adapter interface
export interface DatabaseAdapter {
  connect(config: DatabaseConfig): Promise<void>;
  query<T = any>(query: string, params?: any[], options?: QueryOptions): Promise<QueryResult<T>>;
  insert<T = any>(table: string, data: Partial<T>): Promise<T>;
  update<T = any>(table: string, data: Partial<T>, conditions: Partial<T>): Promise<T>;
  delete<T = any>(table: string, conditions: Partial<T>): Promise<void>;
  disconnect(): Promise<void>;
}

// Database entity interface
export interface Entity {
  id: string | number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Generic repository interface for database operations on a specific entity
export interface Repository<T extends Entity> {
  findAll(options?: QueryOptions): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  findOne(conditions: Partial<T>): Promise<T | null>;
  findMany(conditions: Partial<T>): Promise<T[]>;
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<void>;
}

// Database migration interface
export interface Migration {
  id: string;
  name: string;
  timestamp: Date;
  apply(): Promise<void>;
  rollback(): Promise<void>;
}

// Database transaction interface
export interface Transaction {
  query<T = any>(query: string, params?: any[]): Promise<QueryResult<T>>;
  insert<T = any>(table: string, data: Partial<T>): Promise<T>;
  update<T = any>(table: string, data: Partial<T>, conditions: Partial<T>): Promise<T>;
  delete<T = any>(table: string, conditions: Partial<T>): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}