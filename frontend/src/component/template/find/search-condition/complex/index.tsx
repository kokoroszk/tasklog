import { useSearchQuery } from 'component/template/find/use-search-condition';
import { styler } from 'component/util/styler';

import styles from './index.module.scss';

export const ComplexCondition = () => {
  const condition = styler(styles.complexconditions);
  const { query } = useSearchQuery();
  if (!!query.simpleSearch) condition.add(styles.hidden);
  return <div className={condition.build()}>not implemented.</div>;
};
