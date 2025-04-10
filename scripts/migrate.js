#!/usr/bin/env node

/**
 * Database migration script
 * This script applies database migrations from the migrations directory
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

// Supabase connection info
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY; // Use service key for migrations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_KEY are set in your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to migrations directory
const migrationsDir = path.resolve('database/migrations');

// Ensure migrations table exists
async function ensureMigrationsTable() {
  const { error } = await supabase.rpc('create_migrations_table').catch(() => ({
    error: { message: 'Failed to create migrations table' }
  }));

  if (error) {
    // Try creating it directly if the RPC doesn't exist yet
    const { error: directError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        
        -- Function to get schema version (latest migration id)
        CREATE OR REPLACE FUNCTION get_schema_version() 
        RETURNS INTEGER AS $$
        BEGIN
          RETURN (SELECT COALESCE(MAX(id), 0) FROM migrations);
        END;
        $$ LANGUAGE plpgsql;
        
        -- Function to create migrations table (for initial setup)
        CREATE OR REPLACE FUNCTION create_migrations_table()
        RETURNS VOID AS $$
        BEGIN
          -- This is a no-op since we already created the table
          NULL;
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (directError) {
      console.error('Failed to ensure migrations table exists:', directError.message);
      process.exit(1);
    }
  }
}

// Get applied migrations
async function getAppliedMigrations() {
  const { data, error } = await supabase
    .from('migrations')
    .select('name')
    .order('id', { ascending: true });
  
  if (error) {
    if (error.code === 'PGRST116') { // "Relation does not exist"
      return [];
    }
    console.error('Failed to get applied migrations:', error.message);
    process.exit(1);
  }
  
  return data?.map(m => m.name) || [];
}

// Apply a migration
async function applyMigration(filename) {
  console.log(`Applying migration: ${filename}`);
  
  // Read migration file
  const filePath = path.join(migrationsDir, filename);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Apply migration
  const { error } = await supabase.rpc('execute_sql', { sql_query: sql }).catch(err => ({
    error: { message: `Failed to execute migration: ${err.message}` }
  }));
  
  if (error) {
    console.error(`Failed to apply migration ${filename}:`, error.message);
    return false;
  }
  
  // Record migration
  const { error: recordError } = await supabase
    .from('migrations')
    .insert({ name: filename });
  
  if (recordError) {
    console.error(`Failed to record migration ${filename}:`, recordError.message);
    return false;
  }
  
  return true;
}

// Run migrations
async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Ensure migrations table exists
    await ensureMigrationsTable();
    
    // Get list of applied migrations
    const appliedMigrations = await getAppliedMigrations();
    console.log(`Found ${appliedMigrations.length} previously applied migrations`);
    
    // Get all migration files
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure migrations run in alphabetical order
    
    // Filter out already applied migrations
    const pendingMigrations = migrationFiles.filter(file => 
      !appliedMigrations.includes(file)
    );
    
    console.log(`Found ${pendingMigrations.length} pending migrations`);
    
    if (pendingMigrations.length === 0) {
      console.log('✅ Database is up to date, no migrations to apply');
      return;
    }
    
    // Apply pending migrations
    for (const migration of pendingMigrations) {
      const success = await applyMigration(migration);
      if (!success) {
        console.error(`⛔ Migration failed: ${migration}`);
        process.exit(1);
      }
      console.log(`✅ Migration applied: ${migration}`);
    }
    
    console.log(`\n🎉 Successfully applied ${pendingMigrations.length} migrations`);
    
  } catch (error) {
    console.error('⛔ Migration process failed:', error.message);
    process.exit(1);
  }
}

// Run the script
runMigrations().catch(err => {
  console.error('⛔ Script execution failed:', err);
  process.exit(1);
});