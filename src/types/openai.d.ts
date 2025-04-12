declare module 'openai' {
  export default class OpenAI {
    constructor(config: {
      apiKey: string;
      baseURL?: string;
      defaultHeaders?: Record<string, string>;
      dangerouslyAllowBrowser?: boolean;
    });
    
    chat: {
      completions: {
        create(params: {
          model: string;
          messages: Array<{
            role: 'user' | 'assistant' | 'system';
            content: string;
          }>;
          temperature?: number;
          max_tokens?: number;
          top_p?: number;
          frequency_penalty?: number;
          presence_penalty?: number;
        }): Promise<{
          choices: Array<{
            message: {
              content: string;
            };
          }>;
        }>;
      };
    };
  }
} 