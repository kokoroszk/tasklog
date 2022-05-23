import React from 'react';
import { atom, useRecoilState } from 'recoil';

import { SearchConditionHeader } from 'component/template/find/search-condition/header';

import styles from './index.module.scss';
import { SimpleCondition } from 'component/template/find/search-condition/simple';
import { ComplexCondition } from 'component/template/find/search-condition/complex';
import { IssueStatus } from 'domain/issue';
import { Option } from 'component/atom/pulldown';

interface SearchConditionProps {
  options: {
    statusOptions: Option<IssueStatus[]>[];
    categoryOptions: Option<number>[];
    assigneeOptions: Option<string>[];
  };
}

const searchConditionVidiblityAtom = atom({
  key: 'pages.find.searchConditionVisibility',
  default: true,
});

export const useSearchConditionVisibility = () => useRecoilState(searchConditionVidiblityAtom);
export const useSearchConditionVisibilityValue = () => useRecoilState(searchConditionVidiblityAtom)[0];

export const SearchCondition = (props: SearchConditionProps) => {
  return (
    <div className={styles.searchcondition}>
      <SearchConditionHeader />
      <SimpleCondition {...props.options} />
      <ComplexCondition />
    </div>
  );
};
