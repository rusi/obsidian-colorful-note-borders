module.exports = {
    verbose: true,
    preset: 'ts-jest',
    // testEnvironment: 'node',
    // roots: ['<rootDir>/tests'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: ['js', 'ts', 'svelte'],
    collectCoverage: true, // Enable coverage collection
    coverageDirectory: 'coverage', // Directory where coverage reports will be stored
    collectCoverageFrom: [
      'src/**/*.{js,ts}', // Include all JavaScript and TypeScript files in src/
      '!src/**/*.d.ts' // Exclude TypeScript declaration files
    ],
    coverageReporters: ['json', 'lcov', 'text', 'clover'], // Specify coverage reporters

    globalSetup: './tests/global-setup.js',
};
