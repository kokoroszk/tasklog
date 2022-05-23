import { IssueStatus } from 'domain/issue/index';
import {
  useCurrentUserInfoQuery,
  useAllUsersQuery,
  useAllIssueCategoriesQuery,
  useIssueDetailQuery,
  IssueDetailQuery,
  useAllIssuesForFindQuery,
  useAllIssuesForStatusStatQuery,
} from 'client/gen';
import { Option } from 'component/atom/pulldown';

export const useCurrentUserInfo = () => useCurrentUserInfoQuery()[0].data?.currentUser;

export const useAllUsers = () => useAllUsersQuery()[0].data?.users || [];
export const useAllUserPulldownOptions: () => Option<string>[] = () =>
  useAllUsers().map((u) => ({ label: u.name, value: u.id }));

export const useAllIssueCategories = () => useAllIssueCategoriesQuery()[0].data?.issueCategories || [];
export const useAllIssueCategoryPulldownOptions: () => Option<number>[] = () =>
  useAllIssueCategories().map((c) => ({ label: c.name, value: c.id }));

export const useIssueDetail = (id: number) =>
  useIssueDetailQuery({
    variables: {
      issueId: id,
    },
  })[0].data?.issues.map(issueMapper)[0];

export const useIssueForFind = () =>
  useAllIssuesForFindQuery()[0]
    .data?.issues.map((i) => ({ ...i, changeLogs: [] }))
    .map(issueMapper) || [];

export const useIssueStatusStat = () =>
  useAllIssuesForStatusStatQuery()[0].data?.issues.reduce(
    (acc, issue) => {
      const n = (s: IssueStatus) => (issue.status === s ? 1 : 0);
      return {
        ready: acc.ready + n(IssueStatus.ready),
        inprogress: acc.inprogress + n(IssueStatus.inprogress),
        processed: acc.processed + n(IssueStatus.processed),
        done: acc.done + n(IssueStatus.done),
      };
    },
    { ready: 0, inprogress: 0, processed: 0, done: 0 },
  ) || { ready: 0, inprogress: 0, processed: 0, done: 0 };

const issueMapper = (i: Omit<IssueDetailQuery['issues'][0], 'projectId'>) => ({
  id: i.id,
  title: i.title,
  kind: i.kind,
  status: i.status,
  categories: i.categories.map((c) => ({ id: c.id, name: c.name })),
  createdAt: new Date(i.createdAt),
  updatedAt: new Date(i.updatedAt),
  createdBy: { id: i.createdBy.id, name: i.createdBy.name },
  assignee: i.assignee && { id: i.assignee.id, name: i.assignee.name },
  dueDate: i.dueDate && new Date(i.dueDate),
  description: i.description,
  changeLogs: i.changeLogs.map((c) => ({
    createdBy: { id: c.createdBy.id, name: c.createdBy.name },
    createdAt: new Date(c.createdAt),
    assignee: c.assignee && { id: c.assignee.id, name: c.assignee.name },
    dueDate: c.dueDate && new Date(c.dueDate),
    status: c.status,
    comment: c.comment,
  })),
});
