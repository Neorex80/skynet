#!/usr/bin/env node

/**
 * Database preparation script
 * This script sets up the database environment for development
 */

// You can use ES modules with Node.js
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

async function prepareDatabase() {
  try {
    console.log('🔧 Preparing database environment...');
    
    // Check connection to database
    console.log('📡 Testing connection to Supabase...');
    
    const { data: testData, error: testError } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)
      .catch(() => ({ data: null, error: { message: 'Connection test failed' } }));
    
    if (testError && testError.code !== 'PGRST116') { // PGRST116 is "Relation doesn't exist" which is expected
      console.error('⛔ Failed to connect to Supabase:', testError.message);
      process.exit(1);
    }
    
    console.log('✅ Successfully connected to Supabase');
    
    // Check if schema exists (this could be improved to check more thoroughly)
    console.log('🔍 Checking database schema...');
    
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_schema_version', {}, { count: 'exact' })
      .catch(() => ({ data: null, error: { code: 'FUNCTION_NOT_FOUND' } }));
    
    // If we can't check schema version, we'll assume it's not set up
    if (schemaError && schemaError.code === 'FUNCTION_NOT_FOUND') {
      console.log('⚠️ Schema version function not found. Database may need initialization.');
      console.log('💾 You can run migrations to set up the database schema.');
    } else if (schemaError) {
      console.error('⛔ Error checking schema version:', schemaError.message);
    } else {
      console.log(`✅ Database schema exists (version: ${schemaData || 'unknown'})`);
    }
    
    console.log('\n📝 Preparation completed. Next steps:');
    console.log('1. To run migrations: npm run migrate');
    console.log('2. To add seed data: npm run seed');
    console.log('3. Start the app: npm run dev');
    
  } catch (error) {
    console.error('⛔ Database preparation failed:', error.message);
    process.exit(1);
  }
}

// Run the script
prepareDatabase().catch(err => {
  console.error('⛔ Script execution failed:', err);
  process.exit(1);
});