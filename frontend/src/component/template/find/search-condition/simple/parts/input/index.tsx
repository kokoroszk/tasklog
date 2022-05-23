import { TextInput } from 'component/atom/input';
import { useSearchQuery } from 'component/template/find/use-search-condition';
import React from 'react';

import styles from './index.module.scss';

interface TextInputProps {
  title: string;
}

export const SearchTextInput = (props: TextInputProps) => {
  const { query, updateQuery } = useSearchQuery();

  const updateFunction = (v: string) =>
    updateQuery({
      keyword: v,
    });

  return (
    <div className={styles.textinput} key={query.keyword}>
      <TextInput title={props.title} updateFunction={updateFunction} defaultValue={query.keyword || ''} updateOnEnter />
    </div>
  );
};
