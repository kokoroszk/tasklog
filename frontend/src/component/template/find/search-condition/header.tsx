import React from 'react';

import LinkIcon from '@mui/icons-material/Link';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import styles from './header.module.scss';

import { useNotifyNotImplemented } from 'utils/notify-not-implemented';

import { styler } from 'component/util/styler';
import { useSearchQuery } from 'component/template/find/use-search-condition';
import { useSearchConditionVisibility } from 'component/template/find/search-condition';

export const SearchConditionHeader = () => {
  const { query, updateQuery } = useSearchQuery();
  const [isSearchConditionVisible, setSearchConditionVisible] = useSearchConditionVisibility();

  const notifyNotImplemented = useNotifyNotImplemented();

  const simpleSearch = styler();
  const complexSearch = styler();
  if (query.simpleSearch) simpleSearch.add(styles.checked);
  else complexSearch.add(styles.checked);

  const accordionIcon = styler(styles.accordionicon);
  if (isSearchConditionVisible) accordionIcon.add(styles.visible);
  else accordionIcon.add(styles.hidden);

  const clickAccordionIcon = () => setSearchConditionVisible(!isSearchConditionVisible);
  const clickSimpleSearch = () => updateQuery({ simpleSearch: true });
  const clickComplexSearch = () => updateQuery({ simpleSearch: false });

  return (
    <div className={styles.header}>
      <div className={styles.leftside}>
        <div className={styles.accordion} onClick={clickAccordionIcon}>
          <span className={accordionIcon.build()} />
          <div className={styles.accordionlabel}>検索条件</div>
        </div>
        <div className={styles.chooseinputmethod}>
          <button className={simpleSearch.build()} onClick={clickSimpleSearch}>
            シンプルな検索
          </button>
          <button className={complexSearch.build()} onClick={clickComplexSearch}>
            高度な検索
          </button>
        </div>
      </div>
      <div className={styles.rightside}>
        <button onClick={notifyNotImplemented}>
          <LinkIcon />
          短いURL
        </button>
        <button onClick={notifyNotImplemented}>
          <FilterAltIcon />
          検索条件を保存
        </button>
      </div>
    </div>
  );
};
