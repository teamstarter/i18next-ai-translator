import { translateKey } from '../translator';
import { callOpenAI } from '../openaiClient';

// mock the openaiClient module instead of OpenAI directly
jest.mock('../openaiClient');

describe('translateKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 : translate a simple key to French
  it('should translate a simple key to French', async () => {
    // mock the response of callOpenAI
    (callOpenAI as jest.Mock).mockResolvedValue('Se connecter');

    const result = await translateKey('login', 'fr', 'fake-api-key');

    expect(result).toBe('Se connecter');
    expect(callOpenAI).toHaveBeenCalledTimes(1);
    expect(callOpenAI).toHaveBeenCalledWith('Translate "login" to fr', 'fake-api-key');
  });

  // Test 2 : translate a key to English
  it('should translate a key to English', async () => {
    (callOpenAI as jest.Mock).mockResolvedValue('Log in');

    const result = await translateKey('login', 'en', 'fake-api-key');

    expect(result).toBe('Log in');
  });

  // Test 3 : translate with reference context
  it('should translate with reference context', async () => {
    (callOpenAI as jest.Mock).mockResolvedValue('Se connecter à votre compte');

    const referenceContext = 'This is a login page for a professional platform';
    const result = await translateKey('login', 'fr', 'fake-api-key', referenceContext);

    expect(result).toBe('Se connecter à votre compte');
    expect(callOpenAI).toHaveBeenCalledWith(
      expect.stringContaining(referenceContext),
      'fake-api-key'
    );
  });

  // Test 4 : error if key is empty
  it('should throw error when key is empty', async () => {
    await expect(translateKey('', 'fr', 'fake-api-key')).rejects.toThrow(
      'Translation key cannot be empty'
    );
  });

  // Test 5 : error if API fails
  it('should throw error when API fails', async () => {
    (callOpenAI as jest.Mock).mockRejectedValue(new Error('API Error'));

    await expect(translateKey('login', 'fr', 'fake-api-key')).rejects.toThrow('API Error');
  });

  // Test 6 : translation is identical to the key
  it('should handle when translation is identical to the key', async () => {
    (callOpenAI as jest.Mock).mockResolvedValue('login');

    const result = await translateKey('login', 'es', 'fake-api-key');

    expect(result).toBe('login');
  });
});
