import React from 'react';

import { useRouter } from 'next/router';

import { MainTemplate } from 'component/common/main-template';
import { IssueDetail } from 'component/organism/issue-detail';
import { ViewCommentArea } from 'component/template/view/comment';
import { ViewForm } from 'component/template/view/form';
import { ChangeLog, Issue, IssueStatus } from 'domain/issue';
import { useViewForm, ViewFormContext } from 'component/template/view/use-view-form';
import { useAllUserPulldownOptions, useCurrentUserInfo, useIssueDetail } from 'client/hooks';

export const View = () => {
  const router = useRouter();
  const issueId = String(router.query.issueId || '').split('-')[1];
  const issue: Issue | undefined = useIssueDetail(Number(issueId));

  const userInfo = useCurrentUserInfo();
  const allUsers = useAllUserPulldownOptions();
  const form = useViewForm(issue);

  if (!issue || !userInfo) {
    return <></>;
  }

  const preview: ChangeLog | undefined = form.values.preview
    ? {
        createdAt: new Date(),
        createdBy: { id: userInfo.id, name: userInfo.name },
        ...form.values,
        assignee: allUsers
          .filter((u) => u.value === form.values.assignee)
          .map((u) => ({ id: u.value, name: u.label }))[0],
      }
    : undefined;

  return (
    <MainTemplate>
      <ViewFormContext.Provider value={form}>
        <IssueDetail project={userInfo.project} issue={issue} />
        <ViewCommentArea changeLogs={issue.changeLogs} preview={preview} />
        <ViewForm
          options={{
            assigneeOptions: allUsers,
            statusOptions: statusOptions,
          }}
          issue={issue}
        />
      </ViewFormContext.Provider>
    </MainTemplate>
  );
};

const statusOptions = [
  { label: '未対応', value: IssueStatus.ready },
  { label: '処理中', value: IssueStatus.inprogress },
  { label: '処理済み', value: IssueStatus.processed },
  { label: '完了', value: IssueStatus.done },
];
