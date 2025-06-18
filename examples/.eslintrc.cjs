module.exports = {
  root: true,
  // 基础配置
  extends: ["@bestzy/eslint-config"],

  // 针对TypeScript项目
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["@bestzy/eslint-config/typescript"],
    },
    {
      files: ["**/*.jsx", "**/*.tsx"],
      extends: ["@bestzy/eslint-config/react"],
    },
    {
      files: ["**/*.vue"],
      extends: ["@bestzy/eslint-config/vue"],
    },
  ],
};
