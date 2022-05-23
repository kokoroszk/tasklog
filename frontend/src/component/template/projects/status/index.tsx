import React from 'react';

import { ContentCard } from 'component/organism/content-card';
import { MyTooltip } from 'component/util/my-tooltip';
import { IssueStatusTag } from 'component/atom/tag';

import styles from './index.module.scss';

interface StatusProps {
  ready: number;
  inprogress: number;
  processed: number;
  done: number;
}

interface BarProps {
  title: string;
  className: string;
  percentage: number;
}

interface StatContentProps {
  title: string;
  kind: 'ready' | 'inprogress' | 'processed' | 'done';
  count: number;
}

const Bar = (props: BarProps) => (
  <MyTooltip title={props.title} placement="top">
    <span className={props.className} style={{ width: `${props.percentage}%` }} />
  </MyTooltip>
);

const StatContent = (props: StatContentProps) => (
  <div className={styles.content}>
    {props.title}
    <IssueStatusTag kind={props.kind}>{props.count}</IssueStatusTag>
  </div>
);

export const Status = (props: StatusProps) => {
  const { ready, inprogress, processed, done } = props;
  const all = ready + inprogress + processed + done;
  const percentage = {
    ready: (ready / all) * 100,
    inprogress: (inprogress / all) * 100,
    processed: (processed / all) * 100,
    done: (done / all) * 100,
  };

  return (
    <ContentCard
      content={
        <div className={styles.wrapper}>
          <div className={styles.bar}>
            <Bar title="未対応" className={styles.ready} percentage={percentage.ready} />
            <Bar title="処理中" className={styles.inprogress} percentage={percentage.inprogress} />
            <Bar title="処理済み" className={styles.processed} percentage={percentage.processed} />
            <Bar title="完了" className={styles.done} percentage={percentage.done} />
          </div>
          <div className={styles.percentagetxt}>{`${Math.floor(percentage.done)}% 完了`} </div>
          <div className={styles.stat}>
            <StatContent title="未対応" kind="ready" count={ready} />
            <StatContent title="処理中" kind="inprogress" count={inprogress} />
            <StatContent title="処理済み" kind="processed" count={processed} />
            <StatContent title="完了" kind="done" count={done} />
          </div>
        </div>
      }
    />
  );
};
