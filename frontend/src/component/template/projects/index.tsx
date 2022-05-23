import React from 'react';

import styles from './index.module.scss';

import { MainTemplate } from 'component/common/main-template';

import { UpdateType, RecentUpdate } from 'component/template/projects/recent-updates';
import { Status } from 'component/template/projects/status';
import { useIssueStatusStat } from 'client/hooks';

export const Projects = () => {
  const issueStatusStat = useIssueStatusStat();
  return (
    <MainTemplate>
      <div className={styles.container}>
        <div className={styles.left}>
          <h3>プロジェクトホーム 最近の更新 </h3>
          <RecentUpdate actions={mockitems} />
        </div>
        <div className={styles.right}>
          <h4>状態</h4>
          <Status {...issueStatusStat} />
        </div>
      </div>
    </MainTemplate>
  );
};

// mock

const mockdata = (d: Date) => ({
  type: UpdateType.AddIssue,
  user: {
    icon: '/example',
    id: 'testuser1',
    name: '鈴木 心',
  },
  issue: {
    id: 1,
    title: 'サンプルの課題',
  },
  project: {
    name: 'サンプルプロジェクト',
    id: 'SAMPLE',
  },
  detail: '未実装です\nモックデータです\nccc\nddd\neee\nfff\n',
  createdAt: d,
});

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const mockitems = [mockdata(today), mockdata(today), mockdata(today), mockdata(yesterday), mockdata(yesterday)];
