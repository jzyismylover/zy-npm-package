import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZyCommitizen } from '../index';

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('End-to-End Commit Flow', () => {
    it('should generate correct commit message for feature with scope', () => {
      const adapter = new ZyCommitizen();
      
      const answers = {
        type: 'feat',
        scope: 'ui',
        subject: 'add button component',
        body: 'Add a reusable button component with various styles',
        breaking: undefined,
        footer: undefined,
      };

      const message = (adapter as any).formatCommitMessage(answers);

      expect(message).toBe(
        'feat(ui): add button component\n\nAdd a reusable button component with various styles'
      );
    });

    it('should generate correct commit message for fix with breaking change', () => {
      const adapter = new ZyCommitizen();
      
      const answers = {
        type: 'fix',
        scope: 'api',
        subject: 'update authentication method',
        body: 'Change from JWT to OAuth2 for better security',
        breaking: 'The old JWT authentication is no longer supported',
        footer: 'closes #456',
      };

      const message = (adapter as any).formatCommitMessage(answers);

      expect(message).toContain('fix(api): update authentication method');
      expect(message).toContain('Change from JWT to OAuth2 for better security');
      expect(message).toContain('BREAKING CHANGE: The old JWT authentication is no longer supported');
      expect(message).toContain('closes #456');
    });

    it('should generate correct commit message with custom configuration', () => {
      const adapter = new ZyCommitizen({
        maxLineWidth: 80,
        maxHeaderWidth: 60,
        allowCustomScopes: true,
      });
      
      const answers = {
        type: 'docs',
        scope: 'readme',
        subject: 'update installation instructions',
        body: 'Add more detailed installation steps for different environments',
        breaking: undefined,
        footer: undefined,
      };

      const message = (adapter as any).formatCommitMessage(answers);

      expect(message).toContain('docs(readme): update installation instructions');
      expect(message).toContain('Add more detailed installation steps for different environments');
    });

    it('should handle long subject line truncation', () => {
      const adapter = new ZyCommitizen({
        maxHeaderWidth: 50,
      });
      
      const answers = {
        type: 'feat',
        scope: 'components',
        subject: 'add a very long feature description that definitely exceeds the maximum header width limit',
        body: undefined,
        breaking: undefined,
        footer: undefined,
      };

      const message = (adapter as any).formatCommitMessage(answers);
      const header = message.split('\n')[0];

      expect(header).toHaveLength(50);
      expect(header).toContain('...');
    });

    it('should handle multiple scopes from git files', () => {
      const answers = {
        type: 'refactor',
        scope: 'ui/core',
        subject: 'restructure components',
        body: undefined,
        breaking: undefined,
        footer: undefined,
      };

      const adapter = new ZyCommitizen();
      const message = (adapter as any).formatCommitMessage(answers);

      expect(message).toBe('refactor(ui/core): restructure components');
    });

    it('should handle commits without scope', () => {
      const adapter = new ZyCommitizen();
      
      const answers = {
        type: 'chore',
        scope: undefined,
        subject: 'update dependencies',
        body: undefined,
        breaking: undefined,
        footer: undefined,
      };

      const message = (adapter as any).formatCommitMessage(answers);

      expect(message).toBe('chore: update dependencies');
    });

    it('should handle empty body, breaking, and footer', () => {
      const adapter = new ZyCommitizen();
      
      const answers = {
        type: 'style',
        scope: 'css',
        subject: 'fix formatting',
        body: '',
        breaking: '',
        footer: '',
      };

      const message = (adapter as any).formatCommitMessage(answers);

      expect(message).toBe('style(css): fix formatting');
    });
  });

  describe('Configuration Merging', () => {
    it('should merge custom options with defaults', () => {
      const customOptions = {
        maxLineWidth: 120,
        allowCustomScopes: false,
        scopes: ['custom1', 'custom2'],
      };

      const adapter = new ZyCommitizen(customOptions);
      
      // Test that custom options are applied
      expect((adapter as any).options.maxLineWidth).toBe(120);
      expect((adapter as any).options.allowCustomScopes).toBe(false);
      expect((adapter as any).options.scopes).toEqual(['custom1', 'custom2']);
      
      // Test that default options are preserved
      expect((adapter as any).options.maxHeaderWidth).toBe(72);
      expect((adapter as any).options.allowBreakingChanges).toEqual(['feat', 'fix']);
    });

    it('should deep merge project scan configuration', () => {
      const customOptions = {
        projectScan: {
          packagesPrefix: 'modules',
          maxDirectories: 30,
        },
      };

      const adapter = new ZyCommitizen(customOptions);
      
      expect((adapter as any).options.projectScan.packagesPrefix).toBe('modules');
      expect((adapter as any).options.projectScan.maxDirectories).toBe(30);
      expect((adapter as any).options.projectScan.enableAutoDetection).toBe(true);
      expect((adapter as any).options.projectScan.maxDepth).toBe(3);
    });
  });
});