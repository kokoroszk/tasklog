import { IssueStatus } from 'domain/issue/index';
import { Issue } from 'domain/issue';
import { createContext, useState, useEffect } from 'react';

interface ViewForm {
  comment: string;
  status: Issue['status'];
  assignee: string | undefined;
  dueDate: Issue['dueDate'];
  preview: boolean;
}

interface ViewFormContext {
  values: ViewForm;
  updateValues: (newVal: Partial<ViewForm>) => void;
}

const emptyViewForm: ViewForm = {
  comment: '',
  status: IssueStatus.ready,
  assignee: undefined,
  dueDate: undefined,
  preview: false,
};

export const ViewFormContext = createContext<ViewFormContext>({
  values: emptyViewForm,
  updateValues: () => {
    throw Error('not in add form context.');
  },
});

export const useViewForm = (issue: Issue | undefined): ViewFormContext => {
  const [values, setValues] = useState<ViewForm>({
    comment: '',
    status: issue?.status || 0,
    assignee: issue?.assignee?.id,
    dueDate: issue?.dueDate,
    preview: false,
  });

  const updateValues = (newVal: Partial<ViewForm>) =>
    setValues({
      ...values,
      ...newVal,
    });

  // graphqlでissueを取得した後に、フォームの初期値を更新する
  useEffect(() => {
    if (issue) {
      setValues({
        comment: '',
        status: issue.status,
        assignee: issue.assignee?.id,
        dueDate: issue.dueDate,
        preview: false,
      });
    }
  }, [JSON.stringify(issue)]);

  // previewに変更した場合に、対象が見えるように一番下までスクロールする
  useEffect(() => {
    if (values.preview) window.scrollTo({ top: 10000000, behavior: 'smooth' });
  }, [values.preview]);

  return { values, updateValues };
};
