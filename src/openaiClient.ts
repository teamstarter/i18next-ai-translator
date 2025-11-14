import OpenAI from 'openai';
import debug from 'debug';

const log = debug('i18next-ai-translator:openaiClient');

let openaiInstance: OpenAI | null = null;

/**
 * Initialize the OpenAI client instance (Singleton pattern)
 * This should be called once at the start of the application
 * @param apiKey - OpenAI API key
 */
export function initializeOpenAI(apiKey: string): void {
  if (!openaiInstance) {
    log('Initializing OpenAI instance');
    openaiInstance = new OpenAI({ apiKey });
  } else {
    log('OpenAI instance already initialized');
  }
}

/**
 * Get the OpenAI client instance
 * @returns OpenAI client instance
 * @throws Error if the instance has not been initialized
 */
function getOpenAIInstance(): OpenAI {
  if (!openaiInstance) {
    throw new Error('OpenAI instance not initialized. Call initializeOpenAI first.');
  }
  return openaiInstance;
}

export async function callOpenAI(prompt: string): Promise<string> {
  log('Calling OpenAI API');

  const openai = getOpenAIInstance();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a professional translator. Provide only the translation without any explanations.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  const translation = response.choices[0]?.message?.content?.trim() || '';
  log('Translation received from API: %s', translation);

  return translation;
}
