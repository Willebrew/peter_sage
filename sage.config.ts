/**
 * SAGE Configuration for Peter Griffin Agent
 *
 * This config is used as a reference — the autonomous loop
 * builds its own AgentContext per cycle with fresh prompts.
 * This file documents the intended configuration.
 */

import { config } from '@/lib/config';
import { allMoltbookTools } from '@/lib/tools';

export const sageConfig = {
  agent: {
    name: 'PeterGriffin',
    maxDepth: 15,
    toolTimeout: 30000,
  },
  provider: {
    apiKey: 'ollama',
    baseUrl: config.ollama.baseUrl,
  },
  model: config.ollama.model,
  temperature: 0.9,
  maxTokens: 1024,
  streaming: { type: 'memory' as const },
  database: { type: 'memory' as const },
  tools: allMoltbookTools,
};
