#!/usr/bin/env tsx

/**
 * Check Experiment Status Script
 * Shows detailed experiment information
 */

import dotenv from 'dotenv';
import { mcpClient } from './lib/mcp-client.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Check experiment status
 */
async function checkExperiment(experimentId: string): Promise<void> {
  console.log(`🔍 Checking experiment: ${experimentId}`);
  
  try {
    const result = await mcpClient.getExperimentDetails(experimentId);
    
    if (!result.success) {
      throw new Error(`Failed to fetch experiment: ${result.error}`);
    }
    
    const experiment = result.data.data || result.data;
    console.log('\n📊 Experiment Details:');
    console.log('====================');
    console.log(`ID: ${experiment.id}`);
    console.log(`Name: ${experiment.name}`);
    console.log(`Status: ${experiment.status}`);
    console.log(`Description: ${experiment.description}`);
    console.log(`Primary Metrics: ${experiment.primaryMetrics?.length || 0}`);
    console.log(`Secondary Metrics: ${experiment.secondaryMetrics?.length || 0}`);
    
    console.log('\n🔍 Raw API Response:');
    console.log('===================');
    console.log(JSON.stringify(experiment, null, 2));
    
    if (experiment.primaryMetrics && experiment.primaryMetrics.length > 0) {
      console.log('\n📈 Primary Metrics:');
      experiment.primaryMetrics.forEach((metric, i) => {
        console.log(`  ${i + 1}. ${metric.name} (${metric.type})`);
      });
    }
    
    if (experiment.secondaryMetrics && experiment.secondaryMetrics.length > 0) {
      console.log('\n📊 Secondary Metrics:');
      experiment.secondaryMetrics.forEach((metric, i) => {
        console.log(`  ${i + 1}. ${metric.name} (${metric.type})`);
      });
    }
    
    console.log(`\nGroups: ${experiment.groups?.length || 0}`);
    if (experiment.groups && experiment.groups.length > 0) {
      experiment.groups.forEach((group, i) => {
        console.log(`  ${i + 1}. ${group.name} (${group.size}%)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to check experiment:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const experimentId = process.argv[2] || 'button_color_test';
  
  console.log('🔍 Statsig Experiment Checker');
  console.log('==============================');
  console.log(`Target experiment: ${experimentId}`);
  
  try {
    await checkExperiment(experimentId);
  } catch (error) {
    console.error('\n❌ Failed to check experiment:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
