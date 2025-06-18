export interface CommitType {
  value: string;
  name: string;
  description: string;
}

export interface CommitAnswers {
  type: string;
  scope?: string;
  subject: string;
  body?: string;
  breaking?: string;
  footer?: string;
}

export interface CommitOptions {
  maxLineWidth: number;
  maxHeaderWidth: number;
  types: CommitType[];
  scopes?: string[];
  allowCustomScopes: boolean;
  allowBreakingChanges: string[];
}
