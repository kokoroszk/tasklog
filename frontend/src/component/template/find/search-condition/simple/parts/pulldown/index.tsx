import React from 'react';

import { Pulldown } from 'component/atom/pulldown';
import { QueryKey, SearchQuery, useSearchQuery } from 'component/template/find/use-search-condition';

export interface PulldownProps<T extends QueryKey> {
  title: string;
  options: Option<SearchQuery[T]>[];
  target: T;
  with?: React.ReactElement;
}

interface Option<T> {
  label: string;
  value: T;
}

export const SearchPulldown = <T extends QueryKey>(props: PulldownProps<T>) => {
  const { query, updateQuery } = useSearchQuery();

  const updateFunction = (value: SearchQuery[typeof props.target]) => {
    updateQuery({
      [props.target]: value,
    });
  };

  return (
    <Pulldown
      options={props.options}
      updateFunction={updateFunction}
      selected={query[props.target]}
      title={props.title}
      hasClearButton
      hasFilterInput
      with={props.with}
    />
  );
};
