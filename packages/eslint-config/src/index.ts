export interface EslintConfig {
  [key: string]: any;
}

const baseConfig: EslintConfig = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // 代码风格
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],

    // 最佳实践
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "warn",
    "prefer-const": "error",
    "no-var": "error",

    // ES6+
    "arrow-spacing": "error",
    "object-shorthand": "error",
    "prefer-template": "error",

    // 导入
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
  },
};

export default baseConfig;
