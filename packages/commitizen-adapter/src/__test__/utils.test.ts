import { describe, it, expect, vi, beforeEach } from "vitest";
import { execSync } from "child_process";
import {
  getProjectDirectories,
  getModifiedFileScopes,
  extractScopes,
  buildScopeChoices,
} from "../utils";

// Mock child_process
vi.mock("child_process", () => ({
  execSync: vi.fn(),
}));

const mockExecSync = vi.mocked(execSync);

describe("utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProjectDirectories", () => {
    it("should return empty array when auto detection is disabled", () => {
      const result = getProjectDirectories({
        enableAutoDetection: false,
      });
      expect(result).toEqual([]);
    });

    it("should return parsed directories from command output", () => {
      mockExecSync.mockReturnValue(
        "packages/ui\npackages/core\npackages/utils\n"
      );

      const result = getProjectDirectories({
        packagesPrefix: "packages",
        enableAutoDetection: true,
      });

      expect(result).toEqual(["core", "ui", "utils"]);
    });

    it("should filter out excluded patterns", () => {
      mockExecSync.mockReturnValue("src\nlib\nnode_modules\n");

      const result = getProjectDirectories({
        packagesPrefix: "packages",
        excludePatterns: ["node_modules"],
        enableAutoDetection: true,
      });

      expect(result).toEqual(["lib", "src"]);
    });

    it("should return default directories when command fails", () => {
      mockExecSync.mockImplementation(() => {
        throw new Error("Command failed");
      });

      const result = getProjectDirectories();

      expect(result).toEqual([
        "src",
        "lib",
        "components",
        "utils",
        "docs",
        "test",
      ]);
    });

    it("should limit max directories", () => {
      mockExecSync.mockReturnValue(
        Array.from({ length: 100 }, (_, i) => `dir${i}`).join("\n")
      );

      const result = getProjectDirectories({
        maxDirectories: 5,
        enableAutoDetection: true,
      });

      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  describe("getModifiedFileScopes", () => {
    it("should return empty string when auto detection is disabled", () => {
      const result = getModifiedFileScopes({
        enableAutoDetection: false,
      });
      expect(result).toBe("");
    });

    it("should return scopes from staged files", () => {
      mockExecSync.mockReturnValueOnce("packages/ui/src/button.ts\n");

      const result = getModifiedFileScopes({
        packagesPrefix: "packages",
      });

      expect(result).toBe("ui");
    });

    it("should return scopes from modified files when no staged files", () => {
      mockExecSync
        .mockReturnValueOnce("") // staged files
        .mockReturnValueOnce("packages/core/index.ts\n"); // modified files

      const result = getModifiedFileScopes({
        packagesPrefix: "packages",
      });

      expect(result).toBe("core");
    });

    it("should return empty string when command fails", () => {
      mockExecSync.mockImplementation(() => {
        throw new Error("Git command failed");
      });

      const result = getModifiedFileScopes();

      expect(result).toBe("");
    });
  });

  describe("extractScopes", () => {
    it("should extract scopes from file list", () => {
      const fileList = "packages/ui/src/button.ts\npackages/core/index.ts\n";
      const result = extractScopes(fileList, "packages");

      expect(result).toBe("ui/core");
    });

    it("should ignore files not in packages prefix", () => {
      const fileList = "src/index.ts\npackages/ui/button.ts\n";
      const result = extractScopes(fileList, "packages");

      expect(result).toBe("ui");
    });

    it("should handle empty file list", () => {
      const result = extractScopes("", "packages");

      expect(result).toBe("");
    });

    it("should handle custom packages prefix", () => {
      const fileList = "apps/web/src/index.ts\napps/api/server.ts\n";
      const result = extractScopes(fileList, "apps");

      expect(result).toBe("web/api");
    });
  });

  describe("buildScopeChoices", () => {
    it("should build scope choices with auto detection", () => {
      mockExecSync.mockReturnValue("packages/ui/src/button.ts\n");

      const result = buildScopeChoices(["core", "api"], {
        packagesPrefix: "packages",
        enableAutoDetection: true,
      });

      expect(result).toEqual([
        {
          name: "🎯 自动检测: ui",
          value: "ui",
        },
        {
          name: "📝 手动输入",
          value: "custom",
        },
        {
          name: "⚙️ core",
          value: "core",
        },
        {
          name: "⚙️ api",
          value: "api",
        },
      ]);
    });

    it("should build scope choices without auto detection", () => {
      const result = buildScopeChoices(["core", "api"], {
        enableAutoDetection: false,
      });

      expect(result).toEqual([
        {
          name: "📝 手动输入",
          value: "custom",
        },
        {
          name: "⚙️ core",
          value: "core",
        },
        {
          name: "⚙️ api",
          value: "api",
        },
      ]);
    });

    it("should include project directories", () => {
      mockExecSync.mockReturnValue("src\nlib\n");

      const result = buildScopeChoices([], {
        packagesPrefix: "packages",
        enableAutoDetection: true,
      });

      expect(result).toContainEqual({
        name: "📁 lib",
        value: "lib",
      });
      expect(result).toContainEqual({
        name: "📁 src",
        value: "src",
      });
    });

    it("should handle empty static scopes", () => {
      const result = buildScopeChoices([], {
        enableAutoDetection: false,
      });

      expect(result).toEqual([
        {
          name: "📝 手动输入",
          value: "custom",
        },
      ]);
    });
  });
});
