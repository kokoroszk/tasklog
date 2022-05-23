import React from 'react';

import { IssueStatus } from 'domain/issue';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import styles from './index.module.scss';

import { MyTooltip } from 'component/util/my-tooltip';
import { styler } from 'component/util/styler';

import { Status } from 'component/template/find/search-condition/simple/parts/status';
import { SearchPulldown } from 'component/template/find/search-condition/simple/parts/pulldown';
import { SearchTextInput } from 'component/template/find/search-condition/simple/parts/input';
import { useSearchQuery } from 'component/template/find/use-search-condition';
import { useSearchConditionVisibilityValue } from 'component/template/find/search-condition';
import { Option } from 'component/atom/pulldown';

interface SimpleSearchProps {
  categoryOptions: Option<number>[];
  assigneeOptions: Option<string>[];
  statusOptions: Option<IssueStatus[]>[];
}

const AssignToMyself = () => {
  const { updateQuery } = useSearchQuery();

  return (
    <MyTooltip title="私が担当" placement="top">
      <AccountCircleIcon
        className={styles.assingtomyself}
        onClick={() =>
          updateQuery({
            assignee: 'testuser1',
          })
        }
      />
    </MyTooltip>
  );
};

export const SimpleCondition = (props: SimpleSearchProps) => {
  const isSearchConditionVisible = useSearchConditionVisibilityValue();
  const { query } = useSearchQuery();

  const simpleConditions = styler(styles.simpleconditions);
  if (!isSearchConditionVisible || !query.simpleSearch) simpleConditions.add(styles.hidden);

  return (
    <div className={simpleConditions.build()}>
      <Status options={props.statusOptions} />
      <div className={styles.row}>
        <SearchPulldown title="カテゴリー" target="category" options={props.categoryOptions} />
        <SearchPulldown title="担当者" target="assignee" options={props.assigneeOptions} with={<AssignToMyself />} />
        <SearchTextInput title="キーワード" />
      </div>
    </div>
  );
};
