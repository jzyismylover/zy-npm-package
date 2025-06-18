import inquirer from "inquirer";
import chalk from "chalk";
import wrap from "word-wrap";
import { defaultConfig } from "./config.js";
import type { CommitAnswers, CommitOptions } from "./types.js";

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
        type: "input",
        name: "scope",
        message: "影响范围 (可选):",
        when: () =>
          this.options.allowCustomScopes ||
          (this.options.scopes && this.options.scopes.length > 0),
        validate: (input: string) => {
          if (!input) return true;
          if (input.length > 10) {
            return "范围不应超过10个字符";
          }
          return true;
        },
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
      const answers = (await inquirer.prompt(questions)) as CommitAnswers;
      const message = this.formatCommitMessage(answers);

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

// Commitizen适配器接口
export default function (options: Partial<CommitOptions> = {}) {
  const adapter = new ZyCommitizen(options);
  return {
    prompter: adapter.prompter.bind(adapter),
  };
}

// 导出配置和类型
export { defaultConfig } from "./config.js";
export type { CommitAnswers, CommitOptions, CommitType } from "./types.js";
