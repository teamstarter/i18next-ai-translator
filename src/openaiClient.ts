import OpenAI from 'openai';
import debug from 'debug';

const log = debug('i18next-ai-translator:openaiClient');

let openaiInstance: OpenAI | null = null;

/**
 * Create an OpenAI client instance (Singleton pattern)
 * @param apiKey - OpenAI API key
 * @returns OpenAI client instance
 */
export function getOpenAIInstance(apiKey: string): OpenAI {
  // If the instance does not exist, create it
  if (!openaiInstance) {
    log('Creating new OpenAI instance');
    openaiInstance = new OpenAI({ apiKey });
  } else {
    log('Reusing existing OpenAI instance');
  }

  return openaiInstance;
}

export async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  log('Calling OpenAI API');

  const openai = getOpenAIInstance(apiKey);

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
