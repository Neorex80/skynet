/**
 * Database Client 
 * 
 * This module provides a unified interface for database operations.
 * It's designed to support multiple database backends through adapters.
 */

// Import database adapters
import supabaseAdapter from './adapters/supabaseAdapter';
import sqliteAdapter from './adapters/sqliteAdapter';

// Import types
import { DatabaseAdapter, DatabaseConfig, QueryOptions, QueryResult } from '../types/database';

/**
 * DatabaseClient class provides a unified API for database operations
 * regardless of the underlying database technology.
 */
export class DatabaseClient {
  private adapter: DatabaseAdapter;
  private config: DatabaseConfig;
  
  /**
   * Creates a new DatabaseClient instance
   * @param adapter The database adapter to use
   * @param config Database configuration options
   */
  constructor(adapter: DatabaseAdapter, config: DatabaseConfig) {
    this.adapter = adapter;
    this.config = config;
  }
  
  /**
   * Initialize the database connection
   */
  async initialize(): Promise<void> {
    try {
      await this.adapter.connect(this.config);
      console.log(`Connected to ${this.config.type} database successfully`);
    } catch (error) {
      console.error(`Failed to connect to ${this.config.type} database:`, error);
      throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Execute a query against the database
   * @param query SQL query or query object
   * @param params Query parameters
   * @param options Query options
   */
  async query<T = any>(query: string, params?: any[], options?: QueryOptions): Promise<QueryResult<T>> {
    try {
      return await this.adapter.query<T>(query, params, options);
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Insert a record into a table
   * @param table Table name
   * @param data Data to insert
   */
  async insert<T = any>(table: string, data: Partial<T>): Promise<T> {
    try {
      return await this.adapter.insert<T>(table, data);
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw new Error(`Insert operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update records in a table
   * @param table Table name
   * @param data Data to update
   * @param conditions WHERE conditions
   */
  async update<T = any>(table: string, data: Partial<T>, conditions: Partial<T>): Promise<T> {
    try {
      return await this.adapter.update<T>(table, data, conditions);
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw new Error(`Update operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Delete records from a table
   * @param table Table name
   * @param conditions WHERE conditions
   */
  async delete<T = any>(table: string, conditions: Partial<T>): Promise<void> {
    try {
      await this.adapter.delete<T>(table, conditions);
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw new Error(`Delete operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    try {
      await this.adapter.disconnect();
      console.log(`Disconnected from ${this.config.type} database`);
    } catch (error) {
      console.error(`Error disconnecting from ${this.config.type} database:`, error);
      throw new Error(`Database disconnection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Get a database client instance based on environment configuration
 */
export const getDatabaseClient = (): DatabaseClient => {
  // Read database configuration from environment
  const dbType = import.meta.env.VITE_DATABASE_TYPE || 'supabase';
  
  // Configure the appropriate adapter based on database type
  let adapter: DatabaseAdapter;
  let config: DatabaseConfig;
  
  switch (dbType) {
    case 'sqlite':
      adapter = sqliteAdapter;
      config = {
        type: 'sqlite',
        path: import.meta.env.VITE_SQLITE_PATH || ':memory:'
      };
      break;
      
    case 'supabase':
    default:
      adapter = supabaseAdapter;
      config = {
        type: 'supabase',
        url: import.meta.env.VITE_SUPABASE_URL,
        key: import.meta.env.VITE_SUPABASE_ANON_KEY,
        options: {
          schema: import.meta.env.VITE_SUPABASE_SCHEMA || 'public'
        }
      };
      break;
  }
  
  return new DatabaseClient(adapter, config);
};

// Export a singleton instance for app-wide use
export default getDatabaseClient();