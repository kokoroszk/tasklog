import React from 'react';

import styles from './index.module.scss';

const Container = ({ children }: { children: React.ReactNode }) => <div className={styles.issueCard}>{children}</div>;

const Properties = ({ children }: { children: React.ReactNode }) => <div className={styles.properties}>{children}</div>;

const PropertyItem = (props: { label: string; children: React.ReactNode }) => (
  <div className={styles.itemContainer}>
    <div className={styles.attrItem}>
      <div className={styles.label}>{props.label}</div>
      <div className={styles.input}>{props.children}</div>
    </div>
  </div>
);

export const IssueCard = {
  Container,
  Properties,
  PropertyItem,
};
