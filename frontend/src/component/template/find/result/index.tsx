import React, { useMemo } from 'react';
import Link from 'next/link';
import { sortWith } from 'ramda';

import { Issue, IssueKind, IssueKindLabel, IssueStatus, IssueStatusLabel } from 'domain/issue';

import { IssueKindTag, IssueStatusTag } from 'component/atom/tag';
import { styler } from 'component/util/styler';
import {
  IssueForFindPage,
  resultFilter,
  resultOrder,
  SearchQuery,
  useSearchQuery,
} from 'component/template/find/use-search-condition';

import styles from './index.module.scss';

interface ResultProps {
  issues: Issue[];
  projectId: string;
}

interface ParserContext {
  projectId: string;
  query: SearchQuery;
}

interface TableDef {
  label: string;
  prop: keyof IssueForFindPage;
}

const tableDefs: TableDef[] = [
  { label: '種別', prop: 'kind' },
  { label: 'キー', prop: 'id' },
  { label: '件名', prop: 'title' },
  { label: '担当者', prop: 'assignee' },
  { label: '状態', prop: 'status' },
  { label: '登録日', prop: 'createdAt' },
  { label: '期限日', prop: 'dueDate' },
  { label: '更新日', prop: 'updatedAt' },
  { label: '登録者', prop: 'createdBy' },
];

const PAST = new Date(-8640000000000000);
const FUTURE = new Date(8640000000000000);
const dateParser = (d: Date) =>
  d === PAST || d === FUTURE ? '' : `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;

const kindParser = (k: IssueKind) => <IssueKindTag kind={k}>{IssueKindLabel[k]}</IssueKindTag>;
const statusParser = (s: IssueStatus) => <IssueStatusTag kind={s}>{IssueStatusLabel[s]}</IssueStatusTag>;

const useParsedIssues = (issues: Issue[], ctx: ParserContext) =>
  useMemo(() => {
    const { query } = ctx;

    // ソート順序
    const order = resultOrder(query.sort, query.order);

    // オブジェクト値がソート不可のため、この時点でソート可能な表示用値に置き換える
    // 変換前に検索条件によるフィルタリングを行う
    const issues_ = issues.filter(resultFilter(query)).map((issue) => ({
      ...issue,
      assignee: issue.assignee?.name || '',
      createdBy: issue.createdBy.name,
      // 未入力が最下部になるようにasc/descに応じて未来日/過去日を設定する
      dueDate: issue.dueDate || (ctx.query.order ? FUTURE : PAST),
    }));

    // ソートした後、出力用の値に変換する
    return sortWith(order, issues_).map((issue) => ({
      id: `${ctx.projectId}-${issue.id}`,
      kind: kindParser(issue.kind),
      title: issue.title,
      assignee: issue.assignee,
      status: statusParser(issue.status),
      createdAt: dateParser(issue.createdAt),
      updatedAt: dateParser(issue.updatedAt),
      dueDate: dateParser(issue.dueDate),
      createdBy: issue.createdBy,
    }));
  }, [issues, ctx.projectId, JSON.stringify(ctx.query)]);

// ヘッダーに表示するソート状態の三角アイコン
const orderIconClassName = (propName: string, sortKey: string | undefined, order: boolean | undefined) =>
  propName !== sortKey ? '' : styler(styles.ordericon, styles[String(order)]).build();

export const SearchResult = (props: ResultProps) => {
  const { query, updateQuery } = useSearchQuery();
  const issues = useParsedIssues(props.issues, { projectId: props.projectId, query });

  // ページングは未実装
  const start = 1;
  const end = issues.length;

  const changeSortOrder = (prop: keyof IssueForFindPage) => () =>
    updateQuery({
      sort: prop,
      order: query.sort === prop ? !query.order : true,
    });

  return (
    <div className={styles.results}>
      <div>
        全 {issues.length} 件中 {start} 件 ～ {end} を表示
      </div>
      <table>
        <thead>
          <tr>
            {tableDefs.map((def) => (
              <th className={styles[def.prop]} key={def.prop} onClick={changeSortOrder(def.prop)}>
                {def.label}
                <div className={orderIconClassName(def.prop, query.sort, query.order)} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <Link href={`/view/${issue.id}`} key={issue.id}>
              <tr>
                {tableDefs.map((def) => (
                  <td className={styles[def.prop]} key={def.prop}>
                    {issue[def.prop]}
                  </td>
                ))}
              </tr>
            </Link>
          ))}
        </tbody>
      </table>
    </div>
  );
};
