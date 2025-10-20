import { loadDefaultValue } from '../configLoader';
import fs from 'fs';
import path from 'path';

const TEST_DIR = path.join(__dirname, '__test-config__');

describe('loadDefaultValue', () => {
  beforeEach(() => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  // Test 1 : no config file provided
  it('should return default value when no config file is provided', () => {
    const configFilePath = undefined;
    const result = loadDefaultValue(configFilePath);
    expect(result).toBe('__STRING_NOT_TRANSLATED__');
  });

  // Test 2 : config file does not exist
  it('should return default value when config file does not exist', () => {
    // GIVEN : a path to a file that does not exist
    const nonExistentPath = path.join(TEST_DIR, 'does-not-exist.js');

    const result = loadDefaultValue(nonExistentPath);

    expect(result).toBe('__STRING_NOT_TRANSLATED__');
  });
  // Test 3 : config file exists with defaultValue
  it('should return custom default value from config file', () => {
    const configPath = path.join(TEST_DIR, 'custom.config.js');
    const configContent = `
  module.exports = {
  options: {
    defaultValue: 'CUSTOM_NOT_TRANSLATED'
  }
};
`;
    fs.writeFileSync(configPath, configContent);

    const result = loadDefaultValue(configPath);

    expect(result).toBe('CUSTOM_NOT_TRANSLATED');
  });
  // Test 4 : config file exists but has no defaultValue
  it('should return default value when config exists but has no defaultValue', () => {
    const configPath = path.join(TEST_DIR, 'no-default.config.js');
    const configContent = `
module.exports = {
  options: {
    someOtherOption: 'some value'
  }
};
`;
    fs.writeFileSync(configPath, configContent);

    const result = loadDefaultValue(configPath);

    expect(result).toBe('__STRING_NOT_TRANSLATED__');
  });
  // Test 5 : config file exists but has no options
  it('should return default value when config exists but has no options', () => {
    const configPath = path.join(TEST_DIR, 'no-options.config.js');
    const configContent = `
module.exports = {
  someKey: 'some value',
  anotherKey: 123
};
`;
    fs.writeFileSync(configPath, configContent);

    const result = loadDefaultValue(configPath);

    expect(result).toBe('__STRING_NOT_TRANSLATED__');
  });
  // Test 6 : snapshot
  it('should match snapshot for various scenarios', () => {
    const config1Path = path.join(TEST_DIR, 'snapshot1.config.js');
    fs.writeFileSync(
      config1Path,
      `
module.exports = {
  options: {
    defaultValue: 'MISSING_TRANSLATION'
  }
};
`
    );

    const config2Path = path.join(TEST_DIR, 'snapshot2.config.js');
    fs.writeFileSync(
      config2Path,
      `
module.exports = {
  options: {
    defaultValue: 'TODO_TRANSLATE'
  }
};
`
    );

    const config3Path = path.join(TEST_DIR, 'snapshot3.config.js');
    fs.writeFileSync(
      config3Path,
      `
module.exports = {
  options: {
    someOtherOption: 'value'
  }
};
`
    );

    const results = {
      noConfig: loadDefaultValue(undefined),
      nonExistentFile: loadDefaultValue(path.join(TEST_DIR, 'does-not-exist.js')),
      customValue1: loadDefaultValue(config1Path),
      customValue2: loadDefaultValue(config2Path),
      noDefaultValue: loadDefaultValue(config3Path),
    };

    expect(results).toMatchSnapshot();
  });
});
