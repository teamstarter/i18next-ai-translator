import OpenAI from 'openai';
import debug from 'debug';

const log = debug('i18next-ai-translator:translator');

export async function translateKey(
  key: string,
  targetLocale: string,
  apiKey: string,
  referenceContext?: string
): Promise<string> {
  log('Starting translation for key: %s to locale: %s', key, targetLocale);

  if (!key || key.trim() === '') {
    log('Error: Translation key is empty');
    throw new Error('Translation key cannot be empty');
  }

  log('Creating OpenAI client');
  const openai = new OpenAI({ apiKey });

  let prompt = `Translate "${key}" to ${targetLocale}`;

  if (referenceContext) {
    log('Adding reference context to prompt');
    prompt += `\n\nContext: ${referenceContext}`;
  }

  log('Sending request to OpenAI API');

  try {
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
    log('Translation received: %s', translation);

    if (!translation) {
      log('Warning: Empty translation received from API');
      throw new Error('Empty translation received from API');
    }

    return translation;
  } catch (error) {
    log('Error during translation: %o', error);
    throw error;
  }
}
