import { defineConfig, mergeConfig } from 'vitest/config';

import baseViteConfig from '../../vitest.config';

export default mergeConfig(
  baseViteConfig,
  defineConfig({
    test: {
      coverage: {
        // TODO - Remove once we have better coverage
        thresholds: {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
        },
      },
      environment: 'jsdom',
    },
  }),
);
