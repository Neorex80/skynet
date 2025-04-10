/**
 * Supabase database adapter
 * Implements the DatabaseAdapter interface for Supabase
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseAdapter, DatabaseConfig, QueryOptions, QueryResult } from '../../types/database';

class SupabaseAdapter implements DatabaseAdapter {
  private client: SupabaseClient | null = null;
  
  /**
   * Connect to Supabase database
   * @param config Database configuration
   */
  async connect(config: DatabaseConfig): Promise<void> {
    if (config.type !== 'supabase') {
      throw new Error('Invalid configuration for Supabase adapter');
    }
    
    if (!config.url || !config.key) {
      throw new Error('Supabase URL and key are required');
    }
    
    try {
      this.client = createClient(config.url, config.key, {
        auth: {
          persistSession: true
        },
        global: {
          headers: {
            'x-application-name': 'app-name'
          }
        }
      });
      
      // Test the connection
      const { error } = await this.client.from('_dummy_query_').select('*').limit(1);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "Relation does not exist" which is expected for a dummy query
        throw new Error(`Supabase connection test failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      throw new Error(`Failed to connect to Supabase: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Execute a raw SQL query
   * @param query SQL query string
   * @param params Query parameters
   * @param options Query options
   */
  async query<T = any>(query: string, params?: any[], options?: QueryOptions): Promise<QueryResult<T>> {
    if (!this.client) {
      throw new Error('Database connection not established');
    }
    
    try {
      const { data, error, count } = await this.client.rpc('run_sql_query', {
        query_text: query,
        query_params: params
      });
      
      if (error) {
        throw error;
      }
      
      return {
        data: data as T[],
        rowCount: count || data?.length || 0,
        metadata: {}
      };
    } catch (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Insert data into a table
   * @param table Table name
   * @param data Data to insert
   */
  async insert<T = any>(table: string, data: Partial<T>): Promise<T> {
    if (!this.client) {
      throw new Error('Database connection not established');
    }
    
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return result as T;
    } catch (error) {
      console.error(`Supabase insert error for table ${table}:`, error);
      throw new Error(`Insert operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Update data in a table
   * @param table Table name
   * @param data Data to update
   * @param conditions WHERE conditions
   */
  async update<T = any>(table: string, data: Partial<T>, conditions: Partial<T>): Promise<T> {
    if (!this.client) {
      throw new Error('Database connection not established');
    }
    
    try {
      // Build the query with all conditions
      let query = this.client.from(table).update(data);
      
      // Apply all conditions
      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      
      // Execute the query and get the updated record
      const { data: result, error } = await query.select().single();
      
      if (error) {
        throw error;
      }
      
      return result as T;
    } catch (error) {
      console.error(`Supabase update error for table ${table}:`, error);
      throw new Error(`Update operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Delete data from a table
   * @param table Table name
   * @param conditions WHERE conditions
   */
  async delete<T = any>(table: string, conditions: Partial<T>): Promise<void> {
    if (!this.client) {
      throw new Error('Database connection not established');
    }
    
    try {
      // Build the query with all conditions
      let query = this.client.from(table).delete();
      
      // Apply all conditions
      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      
      // Execute the query
      const { error } = await query;
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Supabase delete error for table ${table}:`, error);
      throw new Error(`Delete operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Close the database connection
   */
  async disconnect(): Promise<void> {
    // Supabase client doesn't require explicit disconnection
    this.client = null;
  }
}

export default new SupabaseAdapter();