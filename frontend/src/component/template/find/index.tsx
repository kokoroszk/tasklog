import React from 'react';

import { Issue, IssueStatus } from 'domain/issue';

import { MainTemplate } from 'component/common/main-template';
import { SearchCondition } from 'component/template/find/search-condition';
import { SearchResult } from 'component/template/find/result';
import {
  useAllIssueCategoryPulldownOptions,
  useAllUserPulldownOptions,
  useCurrentUserInfo,
  useIssueForFind,
} from 'client/hooks';

export const Find = () => {
  const currentUser = useCurrentUserInfo();
  const projectId = currentUser?.project.id || '';

  const allUsers = useAllUserPulldownOptions();
  const allIssueCategories = useAllIssueCategoryPulldownOptions();

  const issues: Issue[] = useIssueForFind();

  return (
    <MainTemplate>
      <SearchCondition
        options={{
          statusOptions,
          assigneeOptions: allUsers,
          categoryOptions: allIssueCategories,
        }}
      />
      <SearchResult projectId={projectId} issues={issues} />
    </MainTemplate>
  );
};

const statusOptions = [
  { label: 'すべて', value: [] },
  { label: '未対応', value: [IssueStatus.ready] },
  { label: '処理中', value: [IssueStatus.inprogress] },
  { label: '処理済み', value: [IssueStatus.processed] },
  { label: '完了', value: [IssueStatus.done] },
  { label: '完了以外', value: [IssueStatus.ready, IssueStatus.inprogress, IssueStatus.processed] },
];
