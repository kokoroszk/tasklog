import React from 'react';

import { MainTemplate } from 'component/common/main-template';
import { AddFormContext, useAddForm } from 'component/template/add/use-add-form';
import { AddButtonArea } from 'component/template/add/button-area';
import { InputArea } from 'component/template/add/input-area';
import { IssueDetail } from 'component/organism/issue-detail';
import { Issue } from 'domain/issue';
import {
  useAllIssueCategories,
  useAllIssueCategoryPulldownOptions,
  useAllUserPulldownOptions,
  useAllUsers,
  useCurrentUserInfo,
} from 'client/hooks';

export const Add = () => {
  const userInfo = useCurrentUserInfo();
  const allUsers = useAllUsers();
  const allIssueCategories = useAllIssueCategories();
  const allUserOptionss = useAllUserPulldownOptions();
  const allIssueCategoryOptions = useAllIssueCategoryPulldownOptions();
  const addForm = useAddForm();

  if (!userInfo) return <></>;

  const currentUser = { id: userInfo.id, name: userInfo.name };
  const currentProject = { id: userInfo.project.id, name: userInfo.project.name };
  const preview: Issue = {
    assignee: allUsers.find((u) => u.id === addForm.values.assignee),
    categories: allIssueCategories.filter((c) => c.id === addForm.values.category),
    id: -9999,
    kind: addForm.values.kind,
    dueDate: addForm.values.dueDate,
    status: addForm.values.status,
    title: addForm.values.title,
    description: addForm.values.description,
    createdBy: currentUser,
    createdAt: new Date(),
    updatedAt: new Date(),
    changeLogs: [],
  };

  return (
    <MainTemplate>
      <AddFormContext.Provider value={addForm}>
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: '15px' }}>
          <h3>課題の追加</h3>
          <AddButtonArea />
          {addForm.values.preview ? (
            // preview
            <IssueDetail project={currentProject} issue={preview} />
          ) : (
            <InputArea assigneeOptions={allUserOptionss} categoryOptions={allIssueCategoryOptions} />
          )}
          <AddButtonArea />
        </div>
      </AddFormContext.Provider>
    </MainTemplate>
  );
};
