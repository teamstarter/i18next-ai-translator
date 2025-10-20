# i18next-ai-translator

Fill un-translated keys of i18next language bundles using reference knowledge files.

## Prerequisites

- Node.js >= 18.0.0
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Basic usage

Call the script with npx, it will replace the untranslated keys with a translation

```sh
export I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY=xxxxxxxxx
npx i18next-ai-translator ./myLocalesFolder
```

## Using .env

You can fill a I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY in your .env instead of exporting it.

```sh
npx i18next-ai-translator ./myLocalesFolder
```

## Using a reference file

```sh
export I18NEXT_AI_TRANSLATOR_REFERENCE_FILE=./documentation/myreference.md
npx i18next-ai-translator ./myLocalesFolder
```

## Using a reference file per bundle

You can specify a bundle, containing .md files named like the bundle. Ex: admin.fr -> admin.md

So your reference files can be saved that way:

```
./documentation/myReference.md
./documentation/bundleReferences/admin.md
./documentation/bundleReferences/default.md
./documentation/bundleReferences/login.md
./documentation/bundleReferences/platform.md
```

```sh
export I18NEXT_AI_TRANSLATOR_REFERENCE_FILE=./documentation/myreference.md
export I18NEXT_AI_TRANSLATOR_BUNDLE_REFERENCE_FOLDER=./documentation/bundleReferences/
npx i18next-ai-translator ./myLocalesFolder
```

## Using custom default values

You can specify a i18nextScanner.config.js to extract automatically the name of the defaultValue (**STRING_NOT_TRANSLATED** by default)

```sh
export I18NEXT_AI_TRANSLATOR_CONFIG=./config/.i18nextScanner.config.js
npx i18next-ai-translator ./myLocalesFolder
```

## How it works

1. Reads all JSON translation files in the specified folder
2. Identifies keys marked as `__STRING_NOT_TRANSLATED__`
3. For each untranslated key:
   - Extracts the bundle name (if applicable)
   - Loads the appropriate reference context
   - Calls OpenAI API to translate
   - Writes the translation back to the file
4. Reports success and failure counts

## Development

### Running tests

This project follows Test-Driven Development (TDD) with comprehensive test coverage.

```sh
npm test                  # Run all tests (60 tests)
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
```

### Building and linting

```sh
npm run build             # Compile TypeScript
npm run lint              # Check code style
npm run lint:fix          # Fix code style issues
```