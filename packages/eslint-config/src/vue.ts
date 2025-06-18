import type { EslintConfig } from "./index.js";

const vueConfig: EslintConfig = {
  extends: ["@bestzy/eslint-config/typescript", "plugin:vue/vue3-recommended"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
    extraFileExtensions: [".vue"],
  },
  plugins: ["vue"],
  rules: {
    // Vue 3规则
    "vue/html-indent": ["error", 2],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 3,
        multiline: 1,
      },
    ],
    "vue/html-closing-bracket-newline": [
      "error",
      {
        singleline: "never",
        multiline: "always",
      },
    ],
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "vue/component-definition-name-casing": ["error", "PascalCase"],

    // 组合式API
    "vue/prefer-import-from-vue": "error",
    "vue/prefer-separate-static-class": "error",

    // TypeScript in Vue
    "vue/block-lang": [
      "error",
      {
        script: {
          lang: "ts",
        },
      },
    ],
    "vue/define-macros-order": "error",
    "vue/define-props-declaration": ["error", "type-based"],
    "vue/define-emits-declaration": ["error", "type-based"],

    // 性能
    "vue/no-setup-props-destructure": "error",
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        // 在Vue文件中放宽一些规则
        "@typescript-eslint/no-unused-vars": "off",
        "vue/multi-word-component-names": "off", // 允许单词组件名
      },
    },
  ],
};

export default vueConfig;
