#!/usr/bin/env tsx

/**
 * Create New Experiment Script
 * Creates a new experiment directly in Statsig without git workflow
 */

import dotenv from 'dotenv';
import { mcpClient } from './lib/mcp-client.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * Create new experiment
 */
async function createNewExperiment(experimentId: string, name: string, description: string): Promise<void> {
  console.log(`🚀 Creating new experiment: ${experimentId}`);
  
  try {
    const experimentConfig = {
      id: experimentId,
      name: name,
      description: description,
      hypothesis: `Testing ${name.toLowerCase()}`,
      groups: [
        {
          name: "Control",
          size: 50,
          parameterValues: {
            buttonColor: "blue",
            buttonText: "Add to Cart"
          },
          description: "Blue button (current)"
        },
        {
          name: "Treatment", 
          size: 50,
          parameterValues: {
            buttonColor: "red",
            buttonText: "Add to Cart"
          },
          description: "Red button (test)"
        }
      ],
      primaryMetrics: [],
      secondaryMetrics: [],
      idType: "userID",
      targetingGateID: "",
      tags: ["★ Core"]
    };
    
    console.log('📊 Creating experiment with config:', {
      id: experimentConfig.id,
      name: experimentConfig.name,
      groups: experimentConfig.groups.length
    });
    
    // Create the experiment
    const createResult = await mcpClient.createExperiment(experimentConfig);
    
    if (!createResult.success) {
      throw new Error(`Failed to create experiment: ${createResult.error}`);
    }
    
    console.log('✅ Experiment created successfully!');
    console.log('🎯 Next steps:');
    console.log('   1. Update metrics: npm run experiment:update-metrics button_color_test');
    console.log('   2. Start experiment: npm run experiment:start button_color_test');
    console.log('   3. Generate traffic: npm run traffic -- --users 50 --actions 5');
    
  } catch (error) {
    console.error('❌ Failed to create experiment:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const experimentId = process.argv[2] || 'button_color_test';
  const name = process.argv[3] || 'Button Color Test';
  const description = process.argv[4] || 'Testing the impact of button color on conversion rates';
  
  console.log('🚀 Statsig New Experiment Creator');
  console.log('==================================');
  console.log(`Target experiment: ${experimentId}`);
  console.log(`Name: ${name}`);
  console.log(`Description: ${description}`);
  
  try {
    await createNewExperiment(experimentId, name, description);
    console.log('\n🎉 Experiment created successfully!');
  } catch (error) {
    console.error('\n❌ Failed to create experiment:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
