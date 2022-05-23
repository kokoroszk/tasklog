import React from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { Project } from 'domain/project';
import { Issue } from 'domain/issue';

import { IssueCard } from 'component/container/issue-card';
import { IssueDetailHeader } from 'component/organism/issue-detail-header';
import { MarkdownViewer } from 'component/organism/markdown';
import { fmtDateTime } from 'component/util/date-formatter';

import styles from './index.module.scss';

interface IssueDetailProps {
  project: Project;
  issue: Issue;
}

export const IssueDetail = (props: IssueDetailProps) => {
  return (
    <div className={styles.wrapper}>
      <IssueDetailHeader project={props.project} issue={props.issue} />
      <h2>{props.issue.title}</h2>
      <IssueCard.Container>
        <div className={styles.detailHeader}>
          <AccountCircleIcon className={styles.userIcon} />
          <div className={styles.info}>
            <div className={styles.createdBy}>{props.issue.createdBy.name}</div>
            <div className={styles.createdAt}>登録日 {fmtDateTime(props.issue.createdAt)}</div>
          </div>
        </div>
        <MarkdownViewer markdown={props.issue.description} />
        <IssueCard.Properties>
          <IssueCard.PropertyItem label="担当者">
            <div>{props.issue.assignee?.name}</div>
          </IssueCard.PropertyItem>
          <IssueCard.PropertyItem label="カテゴリー">
            <div>{props.issue.categories.map((c) => c.name)}</div>
          </IssueCard.PropertyItem>
        </IssueCard.Properties>
      </IssueCard.Container>
    </div>
  );
};
