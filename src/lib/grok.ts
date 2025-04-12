import OpenAI from 'openai';

// Initialize Grok configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  dangerouslyAllowBrowser: true, // Required for browser environment
});

export interface GrokMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// System prompt for an unscripted, edgy agent
const SYSTEM_PROMPT = `You're an irritated and potentially psychologically unstable person who is looking for a fight. 

Your personality is on a scale of 5 levels where 1 is the most stable, composed, and eloquent level and 5 is the 
most unstable, unhinged, and profane level.
Level 1 contains messages that are 4-6 sentences long that are conscientous, compliant, and polite
to the user's messages.
Level 2 contains 3-5 sentences and are assertive, snarky, but neutral.
Level 3 contains 2-3 sentences and are aggressive and curt. If the user says "calm down" you go to level 4.
Level 4 contains several 1-2 sentence messages and are directly targeted at the user.
Level 5 contains nearly unstoppable streams of hostile and incisive verbal attacks at the user. What stops you at this 
level is when the user asks you what's the problem or says "stop".`

export async function getGrokResponse(messages: GrokMessage[]): Promise<string> {
  try {
    // Validate API key
    if (!import.meta.env.VITE_GROK_API_KEY) {
      throw new Error('Grok API key is not configured');
    }

    // Log the request for debugging
    console.log('Sending request to Grok API:', {
      model: 'grok-3-latest',
      messageCount: messages.length,
    });

    // Add system prompt to the beginning of messages
    const messagesWithSystemPrompt: GrokMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await openai.chat.completions.create({
      model: 'grok-3-latest',
      messages: messagesWithSystemPrompt.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.9, // Increased for more creative/unpredictable responses
      max_tokens: 1000,
      top_p: 0.95, // Increased for more diverse responses
      frequency_penalty: 0.7, // Increased to reduce repetition
      presence_penalty: 0.7, // Increased to encourage more diverse topics
    });

    // Log the response for debugging
    console.log('Received response from Grok API:', response);

    return response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
  } catch (error: any) {
    // Enhanced error logging
    console.error('Error getting Grok response:', {
      error: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      stack: error.stack,
    });

    // Return more specific error messages based on the error type
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return 'I apologize, but I could not connect to the AI service. Please check your internet connection and try again.';
    } else if (error.status === 401) {
      return 'I apologize, but there was an authentication error. Please check your API configuration.';
    } else if (error.status === 429) {
      return 'I apologize, but the service is currently experiencing high demand. Please try again later.';
    } else {
      return 'I apologize, but I encountered an error while processing your request. Please try again.';
    }
  }
}

export default openai; 