export interface CommitType {
  value: string;
  name: string;
  description?: string;
}

export interface CommitAnswers {
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking?: string;
  footer?: string;
}

export interface ProjectScanConfig {
  /** 项目根目录下的包目录前缀，默认为 "packages" */
  packagesPrefix?: string;
  /** 排除的目录模式列表 */
  excludePatterns?: string[];
  /** 是否启用自动检测功能 */
  enableAutoDetection?: boolean;
  /** 扫描的最大目录数量 */
  maxDirectories?: number;
  /** 只扫描特定深度的目录 */
  maxDepth?: number;
}

export interface CommitOptions {
  maxLineWidth: number;
  maxHeaderWidth: number;
  types: CommitType[];
  scopes: string[];
  allowCustomScopes: boolean;
  allowBreakingChanges: string[];
  /** 项目扫描配置 */
  projectScan: ProjectScanConfig;
}
