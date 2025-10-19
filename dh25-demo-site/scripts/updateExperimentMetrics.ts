#!/usr/bin/env tsx

/**
 * Update Experiment Metrics Script
 * Fetches current experiment configuration and updates it with metrics
 */

import dotenv from 'dotenv';
import { mcpClient } from './lib/mcp-client.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Update experiment with metrics
 */
async function updateExperimentMetrics(experimentId: string): Promise<void> {
  console.log(`🔧 Updating experiment metrics for: ${experimentId}`);
  
  try {
    // Step 1: Get current experiment configuration
    console.log('📥 Fetching current experiment configuration...');
    const currentResult = await mcpClient.getExperimentDetails(experimentId);
    
    if (!currentResult.success) {
      throw new Error(`Failed to fetch experiment: ${currentResult.error}`);
    }
    
    const currentConfig = currentResult.data;
    console.log('✅ Current experiment configuration fetched');
    console.log('📊 Current metrics:', {
      primary: currentConfig.primaryMetrics || [],
      secondary: currentConfig.secondaryMetrics || []
    });
    
    // Step 2: Build updated configuration with event-based metrics
    const experimentData = currentConfig.data || currentConfig;
    console.log('🔍 Debug - experimentData keys:', Object.keys(experimentData));
    console.log('🔍 Debug - experimentData.description:', experimentData.description);
    console.log('🔍 Debug - experimentData.groups:', experimentData.groups);
    
    const updatedConfig = {
      description: experimentData.description || "Testing experiment",
      idType: experimentData.idType || "userID", 
      hypothesis: experimentData.hypothesis || "Testing hypothesis",
      groups: experimentData.groups && experimentData.groups.length > 0 ? experimentData.groups : [
        {
          name: "Control",
          size: 50,
          parameterValues: { buttonColor: "blue" },
          description: "Control group"
        },
        {
          name: "Treatment",
          size: 50, 
          parameterValues: { buttonColor: "red" },
          description: "Treatment group"
        }
      ],
      allocation: experimentData.allocation || 100,
      targetingGateID: experimentData.targetingGateID || "",
      bonferroniCorrection: experimentData.bonferroniCorrection || false,
      defaultConfidenceInterval: experimentData.defaultConfidenceInterval || "95",
      status: experimentData.status || "setup",
      primaryMetrics: [
        {
          name: "purchase",
          type: "event_count",
          direction: "increase"
        }
      ],
      secondaryMetrics: [
        {
          name: "add_to_cart", 
          type: "event_count",
          direction: "increase"
        },
        {
          name: "product_click",
          type: "event_count", 
          direction: "increase"
        }
      ]
    };
    
    console.log('📈 Updated metrics configuration:', {
      primary: updatedConfig.primaryMetrics,
      secondary: updatedConfig.secondaryMetrics
    });
    
    // Step 3: Update experiment via API
    console.log('🔄 Updating experiment with new metrics...');
    const updateResult = await mcpClient.updateExperimentEntirely(experimentId, updatedConfig);
    
    if (!updateResult.success) {
      throw new Error(`Failed to update experiment: ${updateResult.error}`);
    }
    
    console.log('✅ Experiment updated successfully!');
    console.log('🎯 Check your Statsig console Decision Framework to see the new metrics');
    
  } catch (error) {
    console.error('❌ Failed to update experiment metrics:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const experimentId = process.argv[2] || 'button_color_test';
  
  console.log('🚀 Statsig Experiment Metrics Updater');
  console.log('=====================================');
  console.log(`Target experiment: ${experimentId}`);
  
  try {
    await updateExperimentMetrics(experimentId);
    console.log('\n🎉 Metrics update completed successfully!');
    console.log('📊 Next steps:');
    console.log('   1. Check Statsig console → Experiments → button_color_test');
    console.log('   2. Go to Decision Framework tab');
    console.log('   3. Verify Primary Metric is set to "purchase"');
    console.log('   4. Check Secondary Metrics include "add_to_cart" and "product_click"');
  } catch (error) {
    console.error('\n❌ Metrics update failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
