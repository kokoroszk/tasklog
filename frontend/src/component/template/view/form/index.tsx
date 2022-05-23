import React, { useContext, useState } from 'react';

import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';

import { useUpdateIssueMutation } from 'client/gen';

import { Issue, IssueStatus } from 'domain/issue';

import { ViewFormContext } from 'component/template/view/use-view-form';
import { MarkdownEditor } from 'component/organism/markdown';
import { Option, Pulldown } from 'component/atom/pulldown';
import { DatePicker } from 'component/atom/date-picker';
import { Button } from 'component/atom/button';
import { styler } from 'component/util/styler';

import styles from './index.module.scss';
import { useLoadingOverlay } from 'component/util/loading-overlay';
import { useIsSidebarOpenValue } from 'component/organism/sidebar';

interface Props {
  issue: Issue;
  options: {
    statusOptions: Option<IssueStatus>[];
    assigneeOptions: Option<string>[];
  };
}

export const ViewForm = (props: Props) => {
  const [isOpen, setOpen] = useState(false);
  const isSidebarOpen = useIsSidebarOpenValue();
  const open = () => (!isOpen ? setOpen(true) : undefined);
  const close = () => (isOpen ? setOpen(false) : undefined);

  const form = styler(styles.form).add(isOpen ? styles.open : styles.close);
  if (isSidebarOpen) form.add(styles.sidebarOpened);

  const { values, updateValues } = useContext(ViewFormContext);

  const [_, updateIssue] = useUpdateIssueMutation();
  const loading = useLoadingOverlay();
  const submit = async () => {
    try {
      loading.open();
      await updateIssue({
        issueId: props.issue.id,
        issueStatus: values.status,
        comment: values.comment,
        assigneeId: values.assignee,
        dueDate: values.dueDate?.toISOString() as any,
      });
      close();
      setTimeout(() => window.scrollTo({ top: 10000000, behavior: 'smooth' }), 200);
    } finally {
      loading.close();
    }
  };

  if (values.preview) return <PreviewFooter exitPreview={() => updateValues({ preview: false })} submit={submit} />;
  return (
    <div className={form.build()}>
      <div className={styles.fold}>
        <UnfoldLessIcon className={styles.icon} />
      </div>
      <div className={styles.inputArea}>
        <div className={styles.comment} onClick={open}>
          <MarkdownEditor
            updateOnBlur={(v) => updateValues({ comment: v })}
            value={values.comment}
            toolbar={isOpen}
            maxHeight="300px"
          />
        </div>
        <div className={styles.changeStatus}>
          <div className={styles.button} onClick={open}>
            <ArrowCircleDownIcon className={styles.icon} />
            状態の変更
          </div>
        </div>
        <div className={styles.properties}>
          <Pulldown
            title="状態"
            options={props.options.statusOptions}
            selected={values.status}
            updateFunction={(v) => updateValues({ status: v })}
          />
          <Pulldown
            title="担当者"
            options={props.options.assigneeOptions}
            selected={values.assignee}
            updateFunction={(v) => updateValues({ assignee: v })}
          />
          <div>
            <div>期限日</div>
            <DatePicker value={values.dueDate} updateFunction={(v) => updateValues({ dueDate: v })} />
          </div>
        </div>
      </div>
      <div className={styles.buttonArea}>
        <Button color="gray" onClick={close}>
          閉じる
        </Button>
        <Button onClick={() => updateValues({ preview: true })}>プレビュー</Button>
        <Button color="blue" onClick={submit}>
          登録
        </Button>
      </div>
    </div>
  );
};

const PreviewFooter = ({ exitPreview, submit }: { exitPreview: () => void; submit: () => Promise<void> }) => {
  return (
    <div className={styler(styles.form, styles.preview).build()}>
      <div className={styles.message}>コメントのプレビュー中です</div>
      <div className={styles.buttonArea}>
        <Button onClick={exitPreview}>編集</Button>
        <Button
          onClick={async () => {
            await submit();
            exitPreview();
          }}
          color="blue"
        >
          登録
        </Button>
      </div>
    </div>
  );
};
