import React from 'react';

import styles from './index.module.scss';

interface ContentCardProps {
  title?: string;
  content: React.ReactElement | React.ReactElement[];
}

export const ContentCard = (props: ContentCardProps) => (
  <div className={styles.card}>
    {props.title && <div className={styles.title}>{props.title}</div>}
    <div className={styles.contentwrapper}>
      {/* TODO: keyの値の受け取り方がよくない。elm.keyが存在しないケースがある */}
      {[props.content].flat().map((elm) => (
        <div className={styles.content} key={elm.key}>
          {elm}
        </div>
      ))}
    </div>
  </div>
);
