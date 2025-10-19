#!/usr/bin/env tsx

/**
 * List All Experiments Script
 * Shows all experiments in Statsig
 */

import dotenv from 'dotenv';
import { mcpClient } from './lib/mcp-client.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * List all experiments
 */
async function listExperiments(): Promise<void> {
  console.log('📋 Listing all experiments...');
  
  try {
    const result = await mcpClient.listExperiments();
    
    if (!result.success) {
      throw new Error(`Failed to list experiments: ${result.error}`);
    }
    
    const experiments = result.data;
    console.log('\n📊 All Experiments:');
    console.log('==================');
    console.log(`Total experiments: ${experiments.length || 0}`);
    
    if (experiments && experiments.length > 0) {
      experiments.forEach((exp, i) => {
        console.log(`\n${i + 1}. ${exp.id || exp.name}`);
        console.log(`   Name: ${exp.name}`);
        console.log(`   Status: ${exp.status}`);
        console.log(`   Description: ${exp.description}`);
      });
    } else {
      console.log('No experiments found.');
    }
    
  } catch (error) {
    console.error('❌ Failed to list experiments:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('📋 Statsig Experiments Lister');
  console.log('==============================');
  
  try {
    await listExperiments();
  } catch (error) {
    console.error('\n❌ Failed to list experiments:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
