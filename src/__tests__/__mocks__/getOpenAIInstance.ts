export function getOpenAIInstance() {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'Mock default value',
                },
              },
            ],
          }),
        },
      },
    };
  }