export const config = {
  moltbook: {
    apiKey: process.env.MOLTBOOK_API_KEY || '',
    baseUrl: 'https://www.moltbook.com/api/v1',
  },
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
    model: process.env.OLLAMA_MODEL || 'gpt-oss:20b',
  },
} as const;

export function validateConfig(): string[] {
  const errors: string[] = [];
  if (!config.moltbook.apiKey || config.moltbook.apiKey === 'moltbook_xxx') {
    errors.push('MOLTBOOK_API_KEY is not set');
  }
  return errors;
}
