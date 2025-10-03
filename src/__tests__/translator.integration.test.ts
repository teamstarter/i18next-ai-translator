import { translateKey } from '../translator';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const shouldRunIntegration = process.env.RUN_INTEGRATION_TESTS === 'true';

(shouldRunIntegration ? describe : describe.skip)(
  'translateKey - Integration tests with real API',
  () => {
    const apiKey = process.env.I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY;

    beforeAll(() => {
      if (!apiKey) {
        throw new Error('API key missing! Set I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY in .env file');
      }
    });

    it('should translate "login" to French with real API', async () => {
      const result = await translateKey('login', 'fr', apiKey!);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      console.log('Translation result:', result);
    }, 30000);
  }
);
