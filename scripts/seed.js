#!/usr/bin/env node

/**
 * Database seed script
 * This script seeds the database with initial data for development
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import readline from 'readline';

// Load environment variables
config();

// Supabase connection info
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY; // Use service key for seeding

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_KEY are set in your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to seeds directory
const seedsDir = path.resolve('database/seeds');

// Ask for confirmation in production
async function confirmInProduction() {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question('⚠️ WARNING: You are running seeds in production. Are you sure? (y/N) ', answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

// Apply a seed file
async function applySeed(filename) {
  console.log(`Applying seed: ${filename}`);
  
  // Read seed file
  const filePath = path.join(seedsDir, filename);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Execute seed SQL
  const { error } = await supabase.rpc('execute_sql', { sql_query: sql }).catch(err => ({
    error: { message: `Failed to execute seed: ${err.message}` }
  }));
  
  if (error) {
    console.error(`Failed to apply seed ${filename}:`, error.message);
    return false;
  }
  
  return true;
}

// Run seeds
async function runSeeds() {
  try {
    // Check for production environment
    const confirmed = await confirmInProduction();
    if (!confirmed) {
      console.log('❌ Seeding cancelled');
      process.exit(0);
    }
    
    console.log('🌱 Running database seeds...');
    
    // Get all seed files
    const seedFiles = fs.readdirSync(seedsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ensure seeds run in alphabetical order
    
    console.log(`Found ${seedFiles.length} seed files`);
    
    if (seedFiles.length === 0) {
      console.log('⚠️ No seed files found');
      return;
    }
    
    // Apply seeds
    for (const seed of seedFiles) {
      const success = await applySeed(seed);
      if (!success) {
        console.error(`⛔ Seed failed: ${seed}`);
        process.exit(1);
      }
      console.log(`✅ Seed applied: ${seed}`);
    }
    
    console.log(`\n🎉 Successfully applied ${seedFiles.length} seeds`);
    
  } catch (error) {
    console.error('⛔ Seeding process failed:', error.message);
    process.exit(1);
  }
}

// Run the script
runSeeds().catch(err => {
  console.error('⛔ Script execution failed:', err);
  process.exit(1);
});