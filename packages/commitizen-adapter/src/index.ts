import inquirer from "inquirer";
import chalk from "chalk";
import wrap from "word-wrap";
import { defaultConfig } from "./config";
import { buildScopeChoices } from "./utils";
import type { CommitAnswers, CommitOptions } from "./types";

export class ZyCommitizen {
  private options: CommitOptions;

  constructor(options: Partial<CommitOptions> = {}) {
    this.options = { ...defaultConfig, ...options };
  }

  async prompter(cz: any, commit: (message: string) => void): Promise<void> {
    console.log("\n" + chalk.blue("🎯 zy约定式提交助手"));
    console.log(chalk.gray("请按照以下步骤填写提交信息：\n"));

    const questions = [
      {
        type: "list",
        name: "type",
        message: "选择提交类型:",
        choices: this.options.types,
        pageSize: 12,
      },
      {
        type: "list",
        name: "scopeChoice",
        message: "选择作用范围:",
        choices: buildScopeChoices(this.options.scopes),
        pageSize: 15,
        when: () =>
          this.options.allowCustomScopes ||
          (this.options.scopes && this.options.scopes.length > 0),
      },
      {
        type: "input",
        name: "customScope",
        message: "请输入自定义作用范围:",
        when: (answers: any) => {
          return answers.scopeChoice === "custom";
        },
        validate: (input: string) => {
          if (!input || input.trim() === "") {
            return "作用范围不能为空";
          }
          if (input.length > 15) {
            return "范围不应超过15个字符";
          }
          return true;
        },
        filter: (input: string) => input.trim(),
      },
      {
        type: "input",
        name: "subject",
        message: "简短描述:",
        validate: (input: string) => {
          if (!input) {
            return "必须提供简短描述";
          }
          if (input.length > 50) {
            return "简短描述不应超过50个字符";
          }
          return true;
        },
        filter: (input: string) => input.trim(),
      },
      {
        type: "input",
        name: "body",
        message: "详细描述 (可选):",
        filter: (input: string) => input.trim() || undefined,
      },
      {
        type: "input",
        name: "breaking",
        message: "破坏性变更描述 (可选):",
        when: (answers: CommitAnswers) => {
          return this.options.allowBreakingChanges.includes(answers.type);
        },
        filter: (input: string) => input.trim() || undefined,
      },
      {
        type: "input",
        name: "footer",
        message: "关联的Issue (可选，如: #123):",
        filter: (input: string) => input.trim() || undefined,
      },
    ];

    try {
      const answers = (await inquirer.prompt(questions)) as CommitAnswers & {
        scopeChoice?: string;
        customScope?: string;
      };

      // 处理 scope 逻辑
      let finalScope: string | undefined;
      if (answers.scopeChoice) {
        finalScope =
          answers.scopeChoice === "custom"
            ? answers.customScope
            : answers.scopeChoice;
      }

      const finalAnswers: CommitAnswers = {
        type: answers.type,
        scope: finalScope,
        subject: answers.subject,
        body: answers.body,
        breaking: answers.breaking,
        footer: answers.footer,
      };

      const message = this.formatCommitMessage(finalAnswers);

      console.log("\n" + chalk.green("生成的提交信息:"));
      console.log(chalk.gray("─".repeat(50)));
      console.log(message);
      console.log(chalk.gray("─".repeat(50)));

      commit(message);
    } catch (error) {
      console.error(chalk.red("生成提交信息时出错:"), error);
    }
  }

  private formatCommitMessage(answers: CommitAnswers): string {
    const { type, scope, subject, body, breaking, footer } = answers;

    // 构建头部
    let header = type;
    if (scope) {
      header += `(${scope})`;
    }
    header += `: ${subject}`;

    // 确保头部不超过最大长度
    if (header.length > this.options.maxHeaderWidth) {
      header = header.substring(0, this.options.maxHeaderWidth - 3) + "...";
    }

    const parts = [header];

    // 添加正文
    if (body) {
      parts.push("");
      parts.push(wrap(body, { width: this.options.maxLineWidth, indent: "" }));
    }

    // 添加破坏性变更
    if (breaking) {
      parts.push("");
      parts.push(
        "BREAKING CHANGE: " +
          wrap(breaking, {
            width: this.options.maxLineWidth - "BREAKING CHANGE: ".length,
            indent: "",
          })
      );
    }

    // 添加页脚
    if (footer) {
      parts.push("");
      parts.push(footer);
    }

    return parts.join("\n");
  }
}

// 创建默认适配器实例
const adapter = new ZyCommitizen();

// 直接导出 prompter 方法以符合 Commitizen 期望
export const prompter = adapter.prompter.bind(adapter);

// 同时保留工厂函数导出以便自定义配置
export default function (options: Partial<CommitOptions> = {}) {
  const customAdapter = new ZyCommitizen(options);
  return {
    prompter: customAdapter.prompter.bind(customAdapter),
  };
}

// 导出配置和类型
export { defaultConfig } from "./config";
export type { CommitAnswers, CommitOptions, CommitType } from "./types";
export {
  buildScopeChoices,
  getModifiedFileScopes,
  getProjectDirectories,
} from "./utils";
