/**
 * SQLite database adapter
 * Implements the DatabaseAdapter interface for SQLite
 */

import { Database } from 'sql.js';
import { DatabaseAdapter, DatabaseConfig, QueryOptions, QueryResult } from '../../types/database';

// We're using sql.js for SQLite in the browser
class SQLiteAdapter implements DatabaseAdapter {
  private db: Database | null = null;
  
  /**
   * Connect to SQLite database
   * @param config Database configuration
   */
  async connect(config: DatabaseConfig): Promise<void> {
    if (config.type !== 'sqlite') {
      throw new Error('Invalid configuration for SQLite adapter');
    }
    
    try {
      // Dynamically import sql.js
      const SQL = await import('sql.js');
      
      // Initialize SQL.js
      const SQL_JS = await SQL.default();
      
      // Create a new database
      this.db = new SQL_JS.Database();
      
      console.log('SQLite in-memory database initialized');
    } catch (error) {
      console.error('Error initializing SQLite database:', error);
      throw new Error(`Failed to initialize SQLite database: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Execute a SQL query
   * @param query SQL query string
   * @param params Query parameters
   * @param options Query options
   */
  async query<T = any>(query: string, params: any[] = [], options?: QueryOptions): Promise<QueryResult<T>> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    try {
      // Execute the query
      const result = this.db.exec(query, params);
      
      // Transform the result into a more usable format
      const data: T[] = [];
      
      if (result.length > 0) {
        const { columns, values } = result[0];
        
        // Convert rows to objects with column names as keys
        for (const row of values) {
          const obj: Record<string, any> = {};
          
          for (let i = 0; i < columns.length; i++) {
            obj[columns[i]] = row[i];
          }
          
          data.push(obj as T);
        }
      }
      
      return {
        data,
        rowCount: data.length,
        metadata: {}
      };
    } catch (error) {
      console.error('SQLite query error:', error);
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Insert data into a table
   * @param table Table name
   * @param data Data to insert
   */
  async insert<T = any>(table: string, data: Partial<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    try {
      // Prepare column names and values
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map(() => '?').join(', ');
      
      // Build and execute the INSERT query
      const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
      const result = await this.query<T>(query, values);
      
      if (result.data.length === 0) {
        throw new Error('Insert operation did not return the inserted row');
      }
      
      return result.data[0];
    } catch (error) {
      console.error(`SQLite insert error for table ${table}:`, error);
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
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    try {
      // Prepare SET clause
      const setClause = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');
      
      // Prepare WHERE clause
      const whereConditions = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      
      // Parameters include both data and condition values
      const params = [...Object.values(data), ...Object.values(conditions)];
      
      // Build and execute the UPDATE query
      const query = `UPDATE ${table} SET ${setClause} WHERE ${whereConditions} RETURNING *`;
      const result = await this.query<T>(query, params);
      
      if (result.data.length === 0) {
        throw new Error('Update operation did not return the updated row');
      }
      
      return result.data[0];
    } catch (error) {
      console.error(`SQLite update error for table ${table}:`, error);
      throw new Error(`Update operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Delete data from a table
   * @param table Table name
   * @param conditions WHERE conditions
   */
  async delete<T = any>(table: string, conditions: Partial<T>): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    try {
      // Prepare WHERE clause
      const whereConditions = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      
      // Parameters are the condition values
      const params = Object.values(conditions);
      
      // Build and execute the DELETE query
      const query = `DELETE FROM ${table} WHERE ${whereConditions}`;
      await this.query(query, params);
    } catch (error) {
      console.error(`SQLite delete error for table ${table}:`, error);
      throw new Error(`Delete operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Close the database connection
   */
  async disconnect(): Promise<void> {
    if (this.db) {
      try {
        this.db.close();
        this.db = null;
        console.log('SQLite database connection closed');
      } catch (error) {
        console.error('Error closing SQLite database:', error);
        throw new Error(`Failed to close SQLite database: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}

export default new SQLiteAdapter();