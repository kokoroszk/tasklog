import React, { useContext } from 'react';

import { useRouter } from 'next/router';
import { useCurrentUserInfo } from 'client/hooks';
import { useCreateIssueMutation } from 'client/gen';
import { useLoadingOverlay } from 'component/util/loading-overlay';

import styles from './index.module.scss';

import { Button } from 'component/atom/button';
import { AddFormContext } from 'component/template/add/use-add-form';

export const AddButtonArea = () => {
  const { values, updateValues, resetForm } = useContext(AddFormContext);
  const router = useRouter();
  const [data, createIssue] = useCreateIssueMutation();
  const userInfo = useCurrentUserInfo();
  const loading = useLoadingOverlay();

  const submit = async () => {
    try {
      loading.open();
      await createIssue({
        assigneeId: values.assignee,
        dueDate: values.dueDate?.toISOString() as any,
        issueKind: values.kind,
        title: values.title,
        description: values.description,
        issueCategories: values.category ? [values.category] : [],
      });
      close();
      resetForm();
    } finally {
      loading.close();
    }
  };

  // issueを追加するmutationが成功したら画面遷移する
  if (data.data?.createIssue && userInfo) {
    router.push(`/view/${userInfo.project.id}-${data.data.createIssue.id}`);
  }

  return (
    <div className={styles.buttonrow}>
      {/* preview中か否かでpreviewボタンの表示を変える */}
      <Button color={values.preview ? 'gray' : 'white'} onClick={() => updateValues({ preview: !values.preview })}>
        {values.preview ? '戻る' : 'プレビュー'}
      </Button>
      <Button color="blue" onClick={submit}>
        追加
      </Button>
    </div>
  );
};
