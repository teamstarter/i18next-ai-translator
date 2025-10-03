import { translateKey } from '../translator';
import OpenAI from 'openai';

// mock openai
jest.mock('openai');

describe('translateKey', () => {
  // before each test, reset mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 : translate a simple key to French
  it('should translate a simple key to French', async () => {
    // mock the API response
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Se connecter',
          },
        },
      ],
    });

    // mock the OpenAI class to use our fake response
    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      } as unknown as OpenAI;
    });

    // call the function
    const result = await translateKey('login', 'fr', 'fake-api-key');

    expect(result).toBe('Se connecter');

    // verify the API has been called
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  // Test 2 : translate a key to English
  it('should translate a key to English', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Log in',
          },
        },
      ],
    });

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      } as unknown as OpenAI;
    });

    const result = await translateKey('login', 'en', 'fake-api-key');

    expect(result).toBe('Log in');
  });

  // Test 3 : translate with reference context
  it('should translate with reference context', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'Se connecter à votre compte',
          },
        },
      ],
    });

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      } as unknown as OpenAI;
    });

    const referenceContext = 'This is a login page for a professional platform';

    const result = await translateKey('login', 'fr', 'fake-api-key', referenceContext);

    expect(result).toBe('Se connecter à votre compte');

    // verify the context has been passed in the prompt
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining(referenceContext),
          }),
        ]),
      })
    );
  });

  // Test 4 : error if key is empty
  it('should throw error when key is empty', async () => {
    // call the function and verify the error
    await expect(translateKey('', 'fr', 'fake-api-key')).rejects.toThrow(
      'Translation key cannot be empty'
    );
  });

  // Test 5 : error if API fails
  it('should throw error when API fails', async () => {
    // mock the API response to throw an error
    const mockCreate = jest.fn().mockRejectedValue(new Error('API Error'));

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      } as unknown as OpenAI;
    });

    await expect(translateKey('login', 'fr', 'fake-api-key')).rejects.toThrow('API Error');
  });

  // Test 6 : translation is identical to the key
  it('should handle when translation is identical to the key', async () => {
    // mock the API response to return the same word
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'login',
          },
        },
      ],
    });

    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      } as unknown as OpenAI;
    });

    const result = await translateKey('login', 'es', 'fake-api-key');

    // verify the translation is identical to the key
    expect(result).toBe('login');
  });
});
