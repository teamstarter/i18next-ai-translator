# i18next-ai-translator
Fill un-translated keys of i18next language bundles using reference knowledge files.

# Basic usage

Call the script with npx, it will replace the untranslated keys with a translation

```sh
export I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY=xxxxxxxxx
npx i18next-ai-translator ./myLocalesFolder
```

# Using.env

You can fill a I18NEXT_AI_TRANSLATOR_CHAT_GPT_API_KEY in your .env instead of exporting it.

```sh
npx i18next-ai-translator ./myLocalesFolder
```

# Using a reference file

```sh
export I18NEXT_AI_TRANSLATOR_REFERENCE_FILE=./documentation/myreference.md
npx i18next-ai-translator ./myLocalesFolder
```

# Using a reference file per bundle

You can specify a bundle, containing .md files named like the bundle. Ex: admin.fr -> admin.md

So your reference files can be saved that way:

./documentation/myReference.md
./documentation/bundleReferences/admin.md
./documentation/bundleReferences/default.md
./documentation/bundleReferences/login.md
./documentation/bundleReferences/platform.md


```sh
export I18NEXT_AI_TRANSLATOR_REFERENCE_FILE=./documentation/myreference.md
export I18NEXT_AI_TRANSLATOR_BUNDLE_REFERENCE_FOLDER=./documentation/bundleReferences/
npx i18next-ai-translator ./myLocalesFolder
```

# You can specify a i18nextScanner.config.js to extract automatically the name of the defaultValue (__STRING_NOT_TRANSLATED__ by default)

```sh
export I18NEXT_AI_TRANSLATOR_CONFIG=./config/.i18nextScanner.config.js
npx i18next-ai-translator ./myLocalesFolder
```
