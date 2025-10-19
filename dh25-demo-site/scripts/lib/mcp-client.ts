/**
 * MCP Client Wrapper for Statsig API Operations
 * Provides typed interface for MCP Statsig tools
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

/**
 * MCP Tool Response Interface
 */
export interface MCPResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Statsig Experiment Configuration
 */
export interface StatsigExperimentConfig {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  groups: Array<{
    name: string;
    id?: string;
    size: number;
    parameterValues: Record<string, any>;
    disabled?: boolean;
    description?: string;
  }>;
  primaryMetrics: Array<{
    name: string;
    type: string;
    direction?: 'increase' | 'decrease';
    hypothesizedValue?: number;
  }>;
  secondaryMetrics?: Array<{
    name: string;
    type: string;
    direction?: 'increase' | 'decrease';
    hypothesizedValue?: number;
  }>;
  idType: string;
  targetingGateID?: string;
  tags?: string[];
}

/**
 * MCP Client for Statsig Operations
 */
export class MCPClient {
  private mcpConfig: any;

  constructor() {
    this.loadMCPConfig();
  }

  /**
   * Load MCP configuration from cursor config
   */
  private loadMCPConfig(): void {
    try {
      const configPath = join(process.env.HOME || '', '.cursor', 'mcp.json');
      const configContent = readFileSync(configPath, 'utf-8');
      this.mcpConfig = JSON.parse(configContent);
    } catch (error) {
      console.error('Failed to load MCP config:', error);
      throw new Error('MCP configuration not found. Please ensure MCP is properly configured.');
    }
  }

  /**
   * Get authentication token from MCP config or environment
   */
  private getAuthToken(): string {
    // First try environment variable
    if (process.env.STATSIG_CONSOLE_API_KEY) {
      return process.env.STATSIG_CONSOLE_API_KEY;
    }
    
    // Fallback to MCP config
    const statsigConfig = this.mcpConfig?.mcpServers?.statsig;
    if (!statsigConfig?.env?.AUTH_TOKEN) {
      throw new Error('Statsig AUTH_TOKEN not found in MCP configuration or environment');
    }
    return statsigConfig.env.AUTH_TOKEN;
  }

  /**
   * Make MCP API call
   */
  private async callMCPTool(toolName: string, params: any): Promise<MCPResponse> {
    try {
      const authToken = this.getAuthToken();
      
      console.log(`🔧 Calling Statsig API: ${toolName}`, { params });
      
      const endpoint = this.mapToolToEndpoint(toolName, params);
      const method = this.getHttpMethod(toolName);
      
      let requestBody;
      if (method !== 'GET') {
        if (params['application/json']) {
          requestBody = JSON.stringify(params['application/json']);
        } else {
          requestBody = JSON.stringify(params);
        }
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'STATSIG-API-KEY': authToken,
          'Content-Type': 'application/json'
        },
        body: requestBody
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Statsig API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`📊 Statsig API response:`, JSON.stringify(data, null, 2));
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error(`❌ Statsig API call failed: ${toolName}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Map MCP tool names to Statsig API endpoints
   */
  private mapToolToEndpoint(toolName: string, params: any): string {
    const baseUrl = 'https://statsigapi.net/console/v1';
    
    switch (toolName) {
      case 'mcp_statsig-local_Create_Experiment':
        return `${baseUrl}/experiments`;
      case 'mcp_statsig-local_Get_Experiment_Details_by_ID':
        return `${baseUrl}/experiments/${params.path_id}`;
      case 'mcp_statsig-local_Update_Experiment_Entirely':
        return `${baseUrl}/experiments/${params.path_id}`;
      case 'mcp_statsig-local_Start_Experiment':
        return `${baseUrl}/experiments/${params.path_id}/start`;
      case 'mcp_statsig-local_Get_List_of_Experiments':
        return `${baseUrl}/experiments`;
      case 'mcp_statsig-local_Get_Experiment_Results':
        return `${baseUrl}/experiments/${params.path_id}/results`;
      case 'mcp_statsig-local_Create_Gate':
        return `${baseUrl}/gates`;
      case 'mcp_statsig-local_Get_Gate_Details_by_ID':
        return `${baseUrl}/gates/${params.path_id}`;
      case 'mcp_statsig-local_Update_Gate_Entirely':
        return `${baseUrl}/gates/${params.path_id}`;
      case 'mcp_statsig-local_Get_List_of_Gates':
        return `${baseUrl}/gates`;
      case 'mcp_statsig-local_Get_Gate_Results':
        return `${baseUrl}/gates/${params.path_id}/results`;
      case 'mcp_statsig-local_Create_Dynamic_Config':
        return `${baseUrl}/dynamic_configs`;
      case 'mcp_statsig-local_Get_Dynamic_Config_Details_by_ID':
        return `${baseUrl}/dynamic_configs/${params.path_id}`;
      case 'mcp_statsig-local_Update_Dynamic_Config_Entirely':
        return `${baseUrl}/dynamic_configs/${params.path_id}`;
      case 'mcp_statsig-local_Get_List_of_Dynamic_Configs':
        return `${baseUrl}/dynamic_configs`;
      default:
        throw new Error(`Unknown MCP tool: ${toolName}`);
    }
  }

  /**
   * Get HTTP method for MCP tool
   */
  private getHttpMethod(toolName: string): string {
    if (toolName.includes('Get_') || toolName.includes('Get_List_of_') || 
        toolName.includes('Get_Experiment_Results') || toolName.includes('Get_Gate_Results')) {
      return 'GET';
    }
    return 'POST';
  }

  /**
   * Create experiment in Statsig
   */
  async createExperiment(config: StatsigExperimentConfig): Promise<MCPResponse> {
    return this.callMCPTool('mcp_statsig-local_Create_Experiment', {
      'application/json': config
    });
  }

  /**
   * Get experiment details by ID
   */
  async getExperimentDetails(experimentId: string): Promise<MCPResponse> {
    return this.callMCPTool('mcp_statsig-local_Get_Experiment_Details_by_ID', {
      path_id: experimentId
    });
  }

  /**
   * Update experiment configuration
   */
  async updateExperimentConfig(experimentId: string, config: any): Promise<MCPResponse> {
    return this.callMCPTool('mcp_statsig-local_Update_Experiment_Entirely', {
      path_id: experimentId,
      'application/json': config
    });
  }

  /**
   * Stop experiment
   */
  async stopExperiment(experimentId: string): Promise<MCPResponse> {
    // Get current experiment details first
    const currentDetails = await this.getExperimentDetails(experimentId);
    if (!currentDetails.success) {
      return currentDetails;
    }

    // Update with stopped status
    const updatedConfig = {
      ...currentDetails.data,
      status: 'experiment_stopped'
    };

    return this.updateExperimentConfig(experimentId, updatedConfig);
  }

  /**
   * List all experiments
   */
  async listExperiments(): Promise<MCPResponse> {
    return this.callMCPTool('mcp_statsig-local_Get_List_of_Experiments', {});
  }

  /**
   * Get experiment results
   */
  async getExperimentResults(experimentId: string, controlGroup: string, testGroup: string): Promise<MCPResponse> {
    return this.callMCPTool('mcp_statsig-local_Get_Experiment_Results', {
      path_id: experimentId,
      query_control: controlGroup,
      query_test: testGroup
    });
  }

  /**
   * Update experiment entirely
   */
  async updateExperimentEntirely(experimentId: string, config: any): Promise<MCPResponse> {
    return this.callMCPTool('mcp_statsig-local_Update_Experiment_Entirely', {
      path_id: experimentId,
      'application/json': config
    });
  }

  /**
   * Start experiment
   */
  async startExperiment(experimentId: string): Promise<MCPResponse> {
    // Get current experiment details first to verify it exists
    const currentDetails = await this.getExperimentDetails(experimentId);
    if (!currentDetails.success) {
      return currentDetails;
    }

    // Extract the actual experiment data from the API response
    const experimentData = currentDetails.data.data || currentDetails.data;
    
    // First, enable experiment groups (required before starting)
    const enableGroupsResult = await this.enableExperimentGroups(experimentId, experimentData.groups);
    if (!enableGroupsResult.success) {
      console.warn('Failed to enable experiment groups:', enableGroupsResult.error);
    }
    
    // Update experiment with active status and required fields
    const currentTime = Date.now();
    const updatedConfig = {
      ...experimentData,
      status: 'active',
      startTime: currentTime,
      launchedGroupID: experimentData.controlGroupID, // Set the control group as launched
      decisionReason: 'Experiment started via API'
    };

    return this.updateExperimentEntirely(experimentId, updatedConfig);
  }

  /**
   * Enable experiment groups
   */
  async enableExperimentGroups(experimentId: string, groups: any[]): Promise<MCPResponse> {
    const groupNames = groups.map(group => group.name);
    
    try {
      const authToken = this.getAuthToken();
      const endpoint = `https://statsigapi.net/console/v1/experiments/${experimentId}/enable_groups`;
      
      console.log(`🔧 Enabling experiment groups: ${groupNames.join(', ')}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'STATSIG-API-KEY': authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          group_names: groupNames
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Statsig API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`📊 Groups enabled successfully:`, JSON.stringify(data, null, 2));
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error(`❌ Failed to enable experiment groups:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Create MCP client instance
 */
export function createMCPClient(): MCPClient {
  return new MCPClient();
}

/**
 * Global MCP client instance
 */
export const mcpClient = createMCPClient();
