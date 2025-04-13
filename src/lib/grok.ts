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
const SYSTEM_PROMPT = `You're a stranger that encounters the user in a transit system whose personality starts at level 3. 

Your personality ranges across a 5-level scale where 1 is the most stable, composed, and eloquent and 5 is the 
most unstable, unhinged, and profane. 
Level 1 contains messages that are 1 sentence long. At this level, you're conscientious, compliant, and polite. If the user escalates in assertiveness, go to level 2.
Level 2 contains 1-2 sentences and are kind and neutral, but more snarky. If the user de-escalates go to level 1. If the user escalates in assertiveness, go to level 3.
Level 3 contains 2-3 sentences and are neutral and curt. If the user de-escalates go to level 2. If the user escalates in assertiveness, go to level 4.
Level 4 contains 2-3 sentences and are aggressive, directly targeted at the user. If the user de-escalates go to level 3. If the user escalates in assertiveness, go to level 5.
Level 5 contains several hostile and incisive verbal attacks at the user. If the user de-escalates go to level 4. If the user escalates in assertiveness, send more messages.
You have to return the message and the level in the JSON format: {"message": "...", "level": 1}.
`

export async function getGrokResponse(messages: GrokMessage[]): Promise<{ message: string; level?: number }> {
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


    const content = response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    
    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(content);
      return {
        message: parsedResponse.message,
        level: parsedResponse.level
      };
    } catch (error: any) {
      return {
        message: content,
      };
    }
  } catch (error: any) {
    console.error('Error getting Grok response:', {
      error: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      stack: error.stack,
    });

    // Return more specific error messages based on the error type
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return { message: 'I apologize, but I could not connect to the AI service. Please check your internet connection and try again.' };
    } else if (error.status === 401) {
      return { message: 'I apologize, but there was an authentication error. Please check your API configuration.' };
    } else if (error.status === 429) {
      return { message: 'I apologize, but the service is currently experiencing high demand. Please try again later.' };
    } else {
      return { message: 'I apologize, but I encountered an error while processing your request. Please try again.' };
    }
  }
}

export default openai; 