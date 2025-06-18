import type { EslintConfig } from "./index.js";

const reactConfig: EslintConfig = {
  extends: [
    "@bestzy/eslint-config/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // React规则
    "react/react-in-jsx-scope": "off", // React 17+不需要
    "react/prop-types": "off", // 使用TypeScript
    "react/jsx-props-no-spreading": "off",
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".tsx", ".jsx"],
      },
    ],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],

    // JSX规则
    "react/jsx-indent": ["error", 2],
    "react/jsx-indent-props": ["error", 2],
    "react/jsx-closing-bracket-location": "error",
    "react/jsx-closing-tag-location": "error",
    "react/jsx-curly-spacing": ["error", "never"],
    "react/jsx-equals-spacing": ["error", "never"],
    "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
    "react/jsx-max-props-per-line": [
      "error",
      { maximum: 1, when: "multiline" },
    ],

    // Hooks规则
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  overrides: [
    {
      files: ["*.stories.tsx", "*.test.tsx", "*.spec.tsx"],
      rules: {
        "react/jsx-props-no-spreading": "off",
      },
    },
  ],
};

export default reactConfig;
