import { translateKey } from '../translator';
import { callOpenAI } from '../openaiClient';

jest.mock('../openaiClient');

describe('translateKey - Integration tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full translation workflow to French', async () => {
    (callOpenAI as jest.Mock).mockResolvedValue('Connexion');

    const result = await translateKey('login', 'fr', 'test-api-key');

    expect(result).toBe('Connexion');
    expect(callOpenAI).toHaveBeenCalledWith('Translate "login" to fr', 'test-api-key');
  });

  it('should complete full translation workflow to English', async () => {
    (callOpenAI as jest.Mock).mockResolvedValue('Welcome');

    const result = await translateKey('bienvenue', 'en', 'test-api-key');

    expect(result).toBe('Welcome');
    expect(callOpenAI).toHaveBeenCalledWith('Translate "bienvenue" to en', 'test-api-key');
  });
});
