import React from 'react';
import { IssueKind, IssueKindLabelEn, IssueStatus, IssueStatusLabelEn } from 'domain/issue';

import { styler } from 'component/util/styler';
import styles from './index.module.scss';

interface TagProps<T> {
  children: React.ReactNode;
  kind: T;
}

type IssueStatusTagProps = TagProps<IssueStatusTagKind>;
type IssueStatusTagKind = typeof IssueStatusLabelEn[number] | IssueStatus;

type IssueKindTagProps = TagProps<IssueKindTagKind>;
type IssueKindTagKind = typeof IssueKindLabelEn[number] | IssueKind;

export const IssueStatusTag = (props: IssueStatusTagProps) => {
  const key = typeof props.kind === 'number' ? IssueStatusLabelEn[props.kind] : props.kind;
  return <div className={styler(styles.base, styles[key]).build()}>{props.children}</div>;
};

export const IssueKindTag = (props: IssueKindTagProps) => {
  const key = typeof props.kind === 'number' ? IssueKindLabelEn[props.kind] : props.kind;
  return <div className={styler(styles.base, styles[key]).build()}>{props.children}</div>;
};
