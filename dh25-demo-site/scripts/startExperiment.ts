#!/usr/bin/env tsx

/**
 * Start Experiment Script
 * Starts the experiment now that metrics are configured
 */

import dotenv from 'dotenv';
import { mcpClient } from './lib/mcp-client.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Start experiment
 */
async function startExperiment(experimentId: string): Promise<void> {
  console.log(`🚀 Starting experiment: ${experimentId}`);
  
  try {
    // Get current experiment details first
    console.log('📥 Fetching current experiment status...');
    const currentResult = await mcpClient.getExperimentDetails(experimentId);
    
    if (!currentResult.success) {
      throw new Error(`Failed to fetch experiment: ${currentResult.error}`);
    }
    
    const currentConfig = currentResult.data.data || currentResult.data;
    const status = currentConfig.status;
    console.log(`📊 Current status: ${status}`);
    
    if (status === 'active') {
      console.log('✅ Experiment is already active!');
      return;
    }
    
    if (status === 'decision_made') {
      console.log('✅ Experiment has already been completed (decision_made)!');
      console.log('📊 Experiment ran from', new Date(currentConfig.startTime), 'to', new Date(currentConfig.endTime));
      return;
    }
    
    if (status !== 'setup') {
      throw new Error(`Cannot start experiment in ${status} status`);
    }
    
    // Check if metrics are configured
    const hasPrimaryMetrics = currentConfig.primaryMetrics && currentConfig.primaryMetrics.length > 0;
    const hasSecondaryMetrics = currentConfig.secondaryMetrics && currentConfig.secondaryMetrics.length > 0;
    
    console.log('📈 Metrics status:', {
      primary: hasPrimaryMetrics ? currentConfig.primaryMetrics.length : 0,
      secondary: hasSecondaryMetrics ? currentConfig.secondaryMetrics.length : 0
    });
    
    if (!hasPrimaryMetrics) {
      throw new Error('Cannot start experiment without primary metrics');
    }
    
    // Start the experiment
    console.log('🔄 Starting experiment...');
    const startResult = await mcpClient.startExperiment(experimentId);
    
    if (!startResult.success) {
      throw new Error(`Failed to start experiment: ${startResult.error}`);
    }
    
    console.log('✅ Experiment started successfully!');
    console.log('🎯 The experiment is now active and will assign users to variants');
    
  } catch (error) {
    console.error('❌ Failed to start experiment:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const experimentId = process.argv[2] || 'button_color_test';
  
  console.log('🚀 Statsig Experiment Starter');
  console.log('=============================');
  console.log(`Target experiment: ${experimentId}`);
  
  try {
    await startExperiment(experimentId);
    console.log('\n🎉 Experiment started successfully!');
    console.log('📊 Next steps:');
    console.log('   1. Generate traffic: npm run traffic -- --users 50 --actions 5');
    console.log('   2. Check Statsig console → Experiments → button_color_test');
    console.log('   3. Go to Diagnostics tab to see real-time user assignments');
    console.log('   4. Check Results tab in 1-2 hours for statistical analysis');
  } catch (error) {
    console.error('\n❌ Failed to start experiment:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}