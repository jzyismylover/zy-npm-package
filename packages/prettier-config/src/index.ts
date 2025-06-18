export interface PrettierConfig {
  [key: string]: any;
}

const prettierConfig: PrettierConfig = {
  // 基础配置
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // 换行符
  endOfLine: 'lf',
  
  // HTML
  htmlWhitespaceSensitivity: 'css',
  
  // Vue
  vueIndentScriptAndStyle: false,
  
  // 嵌入语言
  embeddedLanguageFormatting: 'auto',
  
  // 文件覆盖配置
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 120,
        proseWrap: 'preserve',
      },
    },
    {
      files: '*.vue',
      options: {
        parser: 'vue',
      },
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
      },
    },
  ],
};

export default prettierConfig; 