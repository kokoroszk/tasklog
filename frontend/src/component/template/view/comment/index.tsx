import React, { useMemo, useState } from 'react';
import { equals, filter, reduce, repeat, update, zip } from 'ramda';
import sanitize from 'sanitize-html';

import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { IssueStatusLabel, ChangeLog } from 'domain/issue';

import { ContentCard } from 'component/organism/content-card';
import { MyTooltip } from 'component/util/my-tooltip';
import { styler } from 'component/util/styler';
import { fmtDate, fmtDateTime } from 'component/util/date-formatter';
import { MarkdownViewer } from 'component/organism/markdown';

import styles from './index.module.scss';

interface Props {
  changeLogs: ChangeLog[];
  preview?: ChangeLog;
}

// changeLogを出力用に整形する
const hasComment = (c: ChangeLog) => !!c.comment;
const curentHasComment = (o: { current: ChangeLog }) => hasComment(o.current);

type CommentData = { before: ChangeLog; current: ChangeLog; preview?: true };
type CommentDataAcc = [ChangeLog | undefined, CommentData[]];
const zipWithPreviouse = reduce(
  (acc: CommentDataAcc, curr: ChangeLog): CommentDataAcc => {
    if (acc[0] === undefined) return [curr, []];
    const currentState = { ...acc[0], ...curr };
    return [currentState, acc[1].concat({ before: acc[0], current: currentState })];
  },
  [undefined, []],
);

const useCommentData = (changeLogs: ChangeLog[], preview: ChangeLog | undefined) => {
  const data = useMemo(() => zipWithPreviouse(changeLogs)[1], [JSON.stringify(changeLogs)]);
  const dataWithPreview = data.concat(
    [preview].flatMap((p) => {
      if (!p) return [];

      // changeLogsが1件(課題追加ログのみ)の場合はdataが空になる
      // その場合は追加ログをbeforeとしてpreviewコメントを作成する
      const before = data.length > 0 ? data[data.length - 1]['current'] : changeLogs[0];
      return {
        before,
        current: p,
        preview: true,
      };
    }),
  );

  // XXX コメントが追加された場合にコメント欄の開閉を管理する領域が足りなくなると表示されない
  const [fold, setFold] = useState(repeat(false, data.length + 100));

  const [commentOnly, setCommentOnly] = useState(false);
  const fltr = commentOnly ? filter(curentHasComment) : <T extends any>(v: T) => v;

  return {
    // zip with fold property.
    commentData: zip(fltr(dataWithPreview), fold).flatMap((a) => ({ ...a[0], fold: a[1] })),
    fold: {
      isAllItemFolded: fold.every((v) => v),
      toggle: (idx: number) => idx < fold.length && setFold(update(idx, !fold[idx], fold)),
      foldAll: () => setFold(fold.map((_) => true)),
      unfoldAll: () => setFold(fold.map((_) => false)),
    },
    commentOnly: {
      value: commentOnly,
      showAll: () => setCommentOnly(false),
      showCommentOnly: () => setCommentOnly(true),
    },
  };
};

// コメント欄のアイテムの表示
interface CommentItemProps {
  before: ChangeLog;
  current: ChangeLog;
  toggleFold: () => void;
  fold?: boolean;
  preview?: boolean;
}

const labelList = ['状態', '担当者', '期限日'];
const valueList = (changeLog: ChangeLog) =>
  [IssueStatusLabel[changeLog.status], changeLog.assignee?.name, changeLog.dueDate && fmtDate(changeLog.dueDate)].map(
    (a) => (a !== undefined && a !== null ? a : '未設定'),
  );

const CommentItem = ({ before, current, fold, toggleFold, preview }: CommentItemProps) => {
  // 状態,担当者などの変更情報
  // 変更があった場合に表示する内容をリストに保持する
  const changedList = zip(zip(valueList(before), valueList(current)), labelList).flatMap((data) => {
    const item = data[0];
    const label = data[1];

    const previouse = item[0];
    const current = item[1];
    return equals(previouse, current) ? [] : `${label}: ${previouse} -> ${current}`;
  });

  const content = styler(styles.content);
  const createdAt = styler(styles.createdAt);
  if (fold) {
    content.add(styles.fold);
    createdAt.add(styles.fold);
  }

  const commentItem = styler(styles.commentItem);
  if (preview) commentItem.add(styles.preview);

  return (
    <div className={commentItem.build()}>
      <div className={styles.header}>
        <AccountCircleIcon className={styles.userIcon} />
        <div className={styles.info} onClick={toggleFold}>
          <div className={styles.createdBy}>{current.createdBy.name}</div>
          <div className={createdAt.build()}>
            {fmtDateTime(current.createdAt)}{' '}
            <span className={styles.content}>{`　/　${changedList.join(' ')} ${sanitize(current.comment || '')}`}</span>
          </div>
        </div>
      </div>
      <div className={content.build()}>
        <ul>
          {changedList.map((data) => (
            <li key={data}>{data}</li>
          ))}
        </ul>
        {current.comment && (
          <div className={styles.comment}>
            <MarkdownViewer markdown={current.comment} />
          </div>
        )}
      </div>
    </div>
  );
};

export const ViewCommentArea = (props: Props) => {
  const { commentData, fold, commentOnly } = useCommentData(props.changeLogs, props.preview);

  const showAll = styler(styles.item);
  const showCommentOnly = styler(styles.item);
  if (commentOnly.value) showCommentOnly.add(styles.selected);
  else showAll.add(styles.selected);

  return (
    <div className={styles.commentArea}>
      <div className={styles.header}>
        <h4>コメント</h4>
        <div className={styles.right}>
          <div className={styles.filter}>
            <div className={styles.label}>表示: </div>
            <div className={showAll.build()} onClick={commentOnly.showAll}>
              すべて表示
            </div>
            <div className={showCommentOnly.build()} onClick={commentOnly.showCommentOnly}>
              コメントのみ表示
            </div>
          </div>
          {fold.isAllItemFolded ? (
            <MyTooltip title="すべて展開" placement="top">
              <div className={styles.unfold} onClick={fold.unfoldAll}>
                <UnfoldMoreIcon className={styles.icon} />
              </div>
            </MyTooltip>
          ) : (
            <MyTooltip title="すべて折りたたむ" placement="top">
              <div className={styles.unfold} onClick={fold.foldAll}>
                <UnfoldLessIcon className={styles.icon} />
              </div>
            </MyTooltip>
          )}
        </div>
      </div>
      <ContentCard
        content={commentData.map((data, idx) => (
          <CommentItem {...data} toggleFold={() => fold.toggle(idx)} key={JSON.stringify(data.current)} />
        ))}
      />
    </div>
  );
};
