import { describe, it, expect } from "vitest";
import type {
  CommitType,
  CommitAnswers,
  CommitOptions,
  ProjectScanConfig,
} from "../types";

describe("types", () => {
  describe("CommitType", () => {
    it("should accept valid commit type", () => {
      const commitType: CommitType = {
        value: "feat",
        name: "Feature",
        description: "A new feature",
      };

      expect(commitType.value).toBe("feat");
      expect(commitType.name).toBe("Feature");
      expect(commitType.description).toBe("A new feature");
    });

    it("should accept commit type without description", () => {
      const commitType: CommitType = {
        value: "feat",
        name: "Feature",
      };

      expect(commitType.value).toBe("feat");
      expect(commitType.name).toBe("Feature");
      expect(commitType.description).toBeUndefined();
    });
  });

  describe("CommitAnswers", () => {
    it("should accept valid commit answers", () => {
      const answers: CommitAnswers = {
        type: "feat",
        scope: "core",
        subject: "add new feature",
        body: "This is a detailed description",
        breaking: "This is a breaking change",
        footer: "closes #123",
      };

      expect(answers.type).toBe("feat");
      expect(answers.scope).toBe("core");
      expect(answers.subject).toBe("add new feature");
      expect(answers.body).toBe("This is a detailed description");
      expect(answers.breaking).toBe("This is a breaking change");
      expect(answers.footer).toBe("closes #123");
    });

    it("should accept minimal commit answers", () => {
      const answers: CommitAnswers = {
        type: "feat",
        subject: "add new feature",
      };

      expect(answers.type).toBe("feat");
      expect(answers.subject).toBe("add new feature");
      expect(answers.scope).toBeUndefined();
      expect(answers.body).toBeUndefined();
      expect(answers.breaking).toBeUndefined();
      expect(answers.footer).toBeUndefined();
    });
  });

  describe("ProjectScanConfig", () => {
    it("should accept valid project scan config", () => {
      const config: ProjectScanConfig = {
        packagesPrefix: "packages",
        excludePatterns: ["node_modules", ".git"],
        enableAutoDetection: true,
        maxDirectories: 50,
        maxDepth: 3,
      };

      expect(config.packagesPrefix).toBe("packages");
      expect(config.excludePatterns).toEqual(["node_modules", ".git"]);
      expect(config.enableAutoDetection).toBe(true);
      expect(config.maxDirectories).toBe(50);
      expect(config.maxDepth).toBe(3);
    });

    it("should accept empty project scan config", () => {
      const config: ProjectScanConfig = {};

      expect(config.packagesPrefix).toBeUndefined();
      expect(config.excludePatterns).toBeUndefined();
      expect(config.enableAutoDetection).toBeUndefined();
      expect(config.maxDirectories).toBeUndefined();
      expect(config.maxDepth).toBeUndefined();
    });
  });

  describe("CommitOptions", () => {
    it("should accept valid commit options", () => {
      const options: CommitOptions = {
        maxLineWidth: 100,
        maxHeaderWidth: 72,
        types: [
          { value: "feat", name: "Feature" },
          { value: "fix", name: "Bug Fix" },
        ],
        scopes: ["core", "ui"],
        allowCustomScopes: true,
        allowBreakingChanges: ["feat", "fix"],
        projectScan: {
          packagesPrefix: "packages",
          enableAutoDetection: true,
        },
      };

      expect(options.maxLineWidth).toBe(100);
      expect(options.maxHeaderWidth).toBe(72);
      expect(options.types).toHaveLength(2);
      expect(options.scopes).toEqual(["core", "ui"]);
      expect(options.allowCustomScopes).toBe(true);
      expect(options.allowBreakingChanges).toEqual(["feat", "fix"]);
      expect(options.projectScan?.packagesPrefix).toBe("packages");
    });
  });
});
