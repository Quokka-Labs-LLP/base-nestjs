import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '@common/(.*)': '<rootDir>/common/$1',
    '@config/(.*)': '<rootDir>/common/config/$1',
    '@constants/(.*)': '<rootDir>/common/constants/$1',
    '@filters/(.*)': '<rootDir>/common/filters/$1',
    '@guards/(.*)': '<rootDir>/common/guards/$1',
    '@helpers/(.*)': '<rootDir>/common/helpers/$1',
    '@interceptors/(.*)': '<rootDir>/common/interceptors/$1',
    '@interfaces/(.*)': '<rootDir>/common/interfaces/$1',
    '@middlewares/(.*)': '<rootDir>/common/middlewares/$1',
    '@pipes/(.*)': '<rootDir>/common/pipes/$1',
    '@resources/(.*)': '<rootDir>/common/resources/$1',
    '@utils/(.*)': '<rootDir>/common/utils/$1',
    '@modules/(.*)': '<rootDir>/modules/$1',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
