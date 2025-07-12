#!/usr/bin/env node

import { ZyCommitizen } from "./index";

async function main() {
  const adapter = new ZyCommitizen();

  await adapter.prompter(null, (message: string) => {
    console.log("\n提交信息已生成，可以使用以下命令提交：");
    console.log(`git commit -m "${message.replace(/"/g, '\\"')}"`);
  });
}

main().catch(console.error);
