import { Issue, IssueStatus } from 'domain/issue';
import { NextRouter, useRouter } from 'next/router';
import { ascend, descend, Ord, prop } from 'ramda';
import mapObjIndexed from 'ramda/src/mapObjIndexed';

export interface SearchQuery {
  simpleSearch?: boolean;
  category?: number;
  assignee?: string;
  status?: IssueStatus[];
  keyword?: string;
  sort?: keyof IssueForFindPage;
  order?: boolean; // true is ascending
}

export type IssueForFindPage = Omit<Issue, 'categories' | 'changeLogs' | 'description'>;

export type QueryKey = keyof SearchQuery;
type QueryValue = NextRouter['query']['myquerykey'];

const toBoolean = (q: QueryValue) => (q === 'true' ? true : false);
const toNumber = (q: QueryValue) => Number(q);
const toString = (q: QueryValue) => String(q);
const toNumberArray = (q: QueryValue) =>
  [q].flat().flatMap((s) => {
    const n = Number(s);
    return [n] || [];
  });

type ParseFunction<T> = (v: QueryValue) => T;
const parser: { [key in QueryKey]: ParseFunction<SearchQuery[key]> } = {
  simpleSearch: toBoolean,
  category: toNumber,
  assignee: toString,
  status: toNumberArray,
  keyword: toString,
  sort: toString as (v: QueryValue) => keyof IssueForFindPage,
  order: toBoolean,
};

const parseQuery = (q: NextRouter['query']) => mapObjIndexed(parse, q) as SearchQuery;
const parse = (val: QueryValue, key: QueryKey) => {
  const f = parser[key];
  return f && f(val);
};

const updateQuery = (router: NextRouter) => (param: SearchQuery) => {
  router.replace(
    {
      pathname: router.pathname,
      query: {
        ...router.query,
        ...param,
      },
    },
    undefined,
    { scroll: false },
  );
};

export const resultFilter =
  (query: SearchQuery) => (issue: Pick<Issue, 'status' | 'assignee' | 'categories' | 'title' | 'description'>) => {
    if (query.status && query.status.every((s) => s !== issue.status)) return false;
    if (query.assignee && query.assignee !== issue.assignee?.id) return false;
    if (query.category && issue.categories.every((c) => c.id !== query.category)) return false;
    if (query.keyword && !(issue.title + issue.description).includes(query.keyword)) return false;
    return true;
  };

export const resultOrder = (sort: keyof IssueForFindPage | undefined, order: boolean | undefined) =>
  [sort]
    .flatMap((sort) => {
      if (sort === undefined) return [];
      const orderFn = order ? ascend : descend;
      return orderFn(prop<keyof IssueForFindPage, Ord>(sort));
    })
    .concat(descend(prop<keyof IssueForFindPage, Ord>('updatedAt')));

export const useSearchQuery = () => {
  const router = useRouter();
  const query = parseQuery(router.query);

  return {
    query,
    updateQuery: updateQuery(router),
  };
};
