import React from 'react';
import { equals } from 'ramda';

import { IssueStatus } from 'domain/issue';
import { useSearchQuery } from 'component/template/find/use-search-condition';

import styles from './index.module.scss';
import { Option } from 'component/atom/pulldown';

interface StatusProps {
  options: Option<IssueStatus[]>[];
}

export const Status = (props: StatusProps) => {
  const { query, updateQuery } = useSearchQuery();
  const status = query.status ? query.status : [];

  return (
    <div className={styles.status}>
      <div className={styles.title}>状態: </div>
      {props.options.map((s) => (
        <>
          <input
            type="radio"
            name="status"
            id={`statusradio.${s.value}`}
            onChange={() =>
              updateQuery({
                status: s.value,
              })
            }
            checked={equals(status, s.value)}
          />
          <label htmlFor={`statusradio.${s.value}`}>{s.label}</label>
        </>
      ))}
    </div>
  );
};
