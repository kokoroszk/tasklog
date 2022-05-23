import { IssueKindTag, IssueStatusTag } from 'component/atom/tag';
import { Project } from 'domain/project';
import { Issue, IssueKindLabel, IssueStatusLabel } from 'domain/issue';
import styles from './index.module.scss';
import { fmtDate } from 'component/util/date-formatter';

interface Props {
  project: Project;
  issue: Issue;
}

export const IssueDetailHeader = (props: Props) => (
  <div className={styles.header}>
    <div className={styles.left}>
      <IssueKindTag kind={props.issue.kind}>{IssueKindLabel[props.issue.kind]}</IssueKindTag>
      <div>{`${props.project.id}-${props.issue.id}`}</div>
    </div>
    <div className={styles.right}>
      <div className={styles.dueDate}>期限日 {fmtDate(props.issue.dueDate)}</div>
      <div className={styles.issueStatus}>
        <IssueStatusTag kind={props.issue.status}>{IssueStatusLabel[props.issue.status]}</IssueStatusTag>
      </div>
    </div>
  </div>
);
