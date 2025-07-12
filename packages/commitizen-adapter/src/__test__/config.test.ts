import { describe, it, expect } from 'vitest';
import { defaultConfig } from '../config';

describe('config', () => {
  describe('defaultConfig', () => {
    it('should have correct default values', () => {
      expect(defaultConfig).toEqual({
        maxLineWidth: 100,
        maxHeaderWidth: 72,
        allowCustomScopes: true,
        allowBreakingChanges: ['feat', 'fix'],
        projectScan: {
          packagesPrefix: 'packages',
          excludePatterns: [
            'node_modules',
            '.git',
            '.vscode',
            '.idea',
            'dist',
            'build',
            'coverage',
            '.next',
            '.nuxt',
            '.DS_Store',
            'temp',
            'tmp',
            'logs',
            '*.log',
          ],
          enableAutoDetection: true,
          maxDirectories: 50,
          maxDepth: 3,
        },
        types: expect.any(Array),
        scopes: expect.any(Array),
      });
    });

    it('should have predefined commit types', () => {
      expect(defaultConfig.types).toHaveLength(11);
      expect(defaultConfig.types).toContainEqual({
        value: 'feat',
        name: '✨ feat:     新功能',
        description: '新增功能或特性',
      });
      expect(defaultConfig.types).toContainEqual({
        value: 'fix',
        name: '🐛 fix:      修复',
        description: '修复bug',
      });
    });

    it('should have predefined scopes', () => {
      expect(defaultConfig.scopes).toEqual([
        'core',
        'ui',
        'api',
        'utils',
        'config',
        'deps',
        'release',
      ]);
    });

    it('should have correct project scan configuration', () => {
      expect(defaultConfig.projectScan).toEqual({
        packagesPrefix: 'packages',
        excludePatterns: expect.arrayContaining([
          'node_modules',
          '.git',
          'dist',
          'build',
        ]),
        enableAutoDetection: true,
        maxDirectories: 50,
        maxDepth: 3,
      });
    });
  });
}); 