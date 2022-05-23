import React from 'react';

import styles from './index.module.scss';

export const DatePicker = ({
  value,
  updateFunction,
}: {
  value?: Date | undefined | null;
  updateFunction: (d: Date | undefined) => void;
}) => {
  return (
    <div className={styles.datepicker}>
      <input
        type="date"
        name="date"
        value={value?.toISOString().substring(0, 10)}
        onChange={(e) => updateFunction(!!e.currentTarget.value ? new Date(e.currentTarget.value) : undefined)}
      />
    </div>
  );
};
