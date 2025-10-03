import OpenAI from 'openai';
import debug from 'debug';

const log = debug('i18next-ai-translator:openaiClient');

export function getOpenAIInstance(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
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
