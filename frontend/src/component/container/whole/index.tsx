import React from 'react';

import styles from './index.module.scss';

interface WholeProps {
  children: React.ReactNode;
}

export const Whole = ({ children }: WholeProps) => (
  <div className={styles.whole}>
    <div className={styles.body}>{children}</div>
  </div>
);
