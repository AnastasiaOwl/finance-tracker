// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '\\.(css|scss)$': 'identity-obj-proxy',
      '^@/(.*)$': '<rootDir>/src/$1',
      '\\.(png|jpe?g|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  };
  