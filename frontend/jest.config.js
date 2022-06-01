module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(spec|test)\\.(ts|tsx|js)', '**/?(*.)+(spec|test)\\.(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  moduleNameMapper: {
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
  },
};
