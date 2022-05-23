import { atom } from 'recoil';
import { IssueKind, IssueStatus } from 'domain/issue';
import { createContext, useState, useEffect } from 'react';
import { equals } from 'ramda';

interface AddForm {
  kind: IssueKind;
  title: string;
  description: string;
  status: IssueStatus;
  assignee?: string;
  category?: number;
  dueDate?: Date;
  preview?: boolean;
}

const emptyAddForm: AddForm = {
  preview: false,
  kind: IssueKind.task,
  title: '',
  description: '',
  status: IssueStatus.ready,
  // dueDate: undefined,
};

interface AddFormContext {
  values: AddForm;
  updateValues: (input: Partial<AddForm>) => void;
  resetForm: () => void;
}

// prettier-ignore
const confirmToRestoreDialog =
`自動バックアップされた変更内容があります。
OKを選択すると内容が復元され、キャンセルを選択するとバックアップを削除します。

復元しますか？`;

export const AddFormContext = createContext<AddFormContext>({
  values: emptyAddForm,
  updateValues: () => {
    throw Error('not in add form context.');
  },
  resetForm: () => {
    throw Error('not in add form context.');
  },
});

const addFormStorageKey = 'add.add-form';
const saveForm = (form: AddForm) => localStorage.setItem(addFormStorageKey, JSON.stringify(form));
const loadForm = () => localStorage.getItem(addFormStorageKey);

export const useAddForm = () => {
  const [values, setValues] = useState(emptyAddForm);

  // 入力中のデータが存在する場合にロードするか確認する
  useEffect(() => {
    const formStr = loadForm();
    if (formStr) {
      const form = JSON.parse(formStr) as AddForm;
      setTimeout(() => {
        if (!equals(form, emptyAddForm)) {
          const shouldRestore = window.confirm(confirmToRestoreDialog);
          // objectはローカルストレージに保存された際にstringになるため、ロード時に復元する
          if (shouldRestore) setValues({ ...form, preview: false, dueDate: form.dueDate && new Date(form.dueDate) });
          else saveForm(emptyAddForm);
        }
      }, 100);
    }
  }, []);

  const updateValues = (input: Partial<AddForm>) => {
    const newVal = {
      ...values,
      ...input,
    };
    setValues(newVal);
    saveForm(newVal);
  };

  const resetForm = () => {
    saveForm(emptyAddForm);
    setValues(emptyAddForm);
  };

  return { values, updateValues, resetForm };
};
