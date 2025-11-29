module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/utils'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'utils/**/*.ts',
    '!utils/**/__tests__/**',
  ],
};
