import React, { useState } from 'react';
import Link from 'next/link';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { Project } from 'domain/project';
import { User } from 'domain/user';

import { styler } from 'component/util/styler';
import { ContentCard } from 'component/organism/content-card';

import styles from './index.module.scss';
import { groupBy } from 'ramda';

export enum UpdateType {
  AddIssue = 'I01',
  UpdateIssue = 'I02',
  CommentIssue = 'I03',
  AddMember = 'P01',
}

interface Issue {
  id: number;
  title: string;
  commentId?: number;
}

export interface Update {
  type: UpdateType;
  user: User;
  issue: Issue;
  project: Project;
  detail: string;
  createdAt: Date;
}

interface Props {
  actions: Update[];
}

const parseDate = ['日', '月', '火', '水', '木', '金', '土'];
const date2str = (d: Date) => {
  const day = parseDate[d.getDay()];
  const year = d.getFullYear();
  const month = d.getMonth();
  const date = d.getDate();
  return `${year}年${month + 1}月${date}日(${day})`;
};

const summaryString = (userName: string, type: UpdateType) => {
  if (type === UpdateType.AddIssue) return `${userName} さんが 課題を追加`;
  if (type === UpdateType.UpdateIssue) return `${userName} さんが 課題を更新`;
  if (type === UpdateType.CommentIssue) return `${userName} さんが 課題にコメント`;
  if (type === UpdateType.AddMember) return `${userName} さんが プロジェクト メンバーを追加しました`;
  throw Error('unexpexted action type.');
};

const Datail = ({ data }: { data: string }) => {
  const [showMore, setShowMore] = useState(false);
  const texts = data.split('\n');

  if (showMore || texts.length <= 5) {
    return <div className={styles.detail}>{texts.flatMap((s) => [<>{s}</>, <br key={`${s}+br`} />])}</div>;
  }

  return (
    <div className={styles.detail}>
      {texts
        .slice(0, 5)
        .flatMap((x) => [<span key={x}>{x}</span>, <br key={`${x}+br`} />])
        .concat([
          <div className={styles.showMore} onClick={() => setShowMore(true)} key="showmore">
            ... もっと読む
          </div>,
        ])}
    </div>
  );
};

export const RecentUpdate = (props: Props) => {
  const groupByCreatedAt = groupBy<Update>((a) => date2str(a.createdAt));
  const items = groupByCreatedAt(props.actions);
  return (
    <div className={styles.recentUpdate}>
      {Object.entries(items).map((e) => (
        <ContentCard
          key={e[0]}
          title={e[0]}
          content={e[1].map((update) => (
            <div className={styles.item} key={`${update.user.id} ${update.createdAt}`}>
              <div className={styles.iconarea}>
                <AccountCircleIcon className={styles.icon} />
              </div>
              <div className={styles.contentarea}>
                <div className={styles.summary}>{summaryString(update.user.name, update.type)}</div>
                <div className={styles.issue}>
                  <Link
                    href={`/view/${update.project.id}-${update.issue.id}${
                      update.issue.commentId ? `#comment-${update.issue.commentId}` : ''
                    }`}
                  >
                    <a>
                      <div
                        className={styler(styles.issueid, styles.balloonoya).build()}
                      >{`${update.project.id}-${update.issue.id}`}</div>
                    </a>
                  </Link>
                  <div className={styles.issuetitle}>{update.issue.title}</div>
                </div>
                <Datail data={update.detail} />
              </div>
            </div>
          ))}
        />
      ))}
    </div>
  );
};
