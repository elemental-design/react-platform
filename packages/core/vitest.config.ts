import { defineConfig } from 'vitest/config';
export default defineConfig({
  resolve: { dedupe: ['react', 'react-test-renderer'] },
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'], include: ['tests/**/*.test.{ts,tsx}'] },
});
