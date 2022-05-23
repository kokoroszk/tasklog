import { zip } from 'ramda';
import { User } from 'domain/user';

export interface Issue {
  id: number;
  kind: IssueKind;
  title: string;
  description: string;
  assignee: User | undefined | null;
  categories: IssueCategory[];
  status: IssueStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | undefined | null;
  createdBy: User;
  changeLogs: ChangeLog[];
}

export interface IssueCategory {
  id: number;
  name: string;
}

export interface ChangeLog {
  status: IssueStatus;
  assignee: User | undefined | null;
  dueDate: Date | undefined | null;
  comment: string;
  createdAt: Date;
  createdBy: User;
}

export enum IssueStatus {
  ready = 0,
  inprogress = 1,
  processed = 2,
  done = 3,
}

export const IssueStatusLabel = ['未対応', '処理中', '処理済み', '完了'] as const;
export const IssueStatusLabelEn = ['ready', 'inprogress', 'processed', 'done'] as const;

export enum IssueKind {
  task = 0,
  Bug = 1,
  request = 2,
  other = 3,
}

const allIssueKind = Object.values(IssueKind).filter((e) => typeof e !== 'string') as IssueKind[];

export const IssueKindLabel = ['タスク', 'バグ', '要望', 'その他'] as const;
export const IssueKindLabelEn = ['task', 'bug', 'request', 'other'] as const;
export const IssueKindWithLabel = zip(allIssueKind, IssueKindLabel).map((k) => ({
  value: k[0],
  label: k[1],
}));
