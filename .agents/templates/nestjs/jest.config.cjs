module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@contracts/(.*)$': [
      '<rootDir>/assets/contracts/generated/typescript/$1',
      '<rootDir>/../../assets/contracts/generated/typescript/$1',
    ],
    '^@configs/(.*)$': [
      '<rootDir>/assets/configs/generated/typescript/$1',
      '<rootDir>/../../assets/configs/generated/typescript/$1',
    ],
  },
};
