import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type ChangeLog = {
  __typename?: 'ChangeLog';
  id: Scalars['Int'];
  comment: Scalars['String'];
  dueDate?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  issue: Issue;
  assignee?: Maybe<User>;
  project: Project;
  createdBy: User;
  status: Scalars['Int'];
  kind: Scalars['Int'];
};


export type Issue = {
  __typename?: 'Issue';
  id: Scalars['Int'];
  projectId: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  dueDate?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  kind: Scalars['Int'];
  status: Scalars['Int'];
  createdBy: User;
  assignee?: Maybe<User>;
  categories: Array<IssueCategory>;
  changeLogs: Array<ChangeLog>;
};

export type IssueCategory = {
  __typename?: 'IssueCategory';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateIssue?: Maybe<Issue>;
  createIssue?: Maybe<Issue>;
};


export type MutationUpdateIssueArgs = {
  issueId: Scalars['Int'];
  issueStatus: Scalars['Int'];
  assigneeId?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  comment: Scalars['String'];
};


export type MutationCreateIssueArgs = {
  title: Scalars['String'];
  description: Scalars['String'];
  issueKind: Scalars['Int'];
  assigneeId?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  issueCategories: Array<Scalars['Int']>;
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  issues: Array<Issue>;
  currentUser?: Maybe<User>;
  projectChangeLogs: Array<ChangeLog>;
  users: Array<User>;
  issueCategories: Array<IssueCategory>;
};


export type QueryIssuesArgs = {
  issueIds?: Maybe<Array<Scalars['Int']>>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  name: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  project: Project;
};

export type CreateIssueMutationVariables = Exact<{
  title: Scalars['String'];
  description: Scalars['String'];
  issueKind: Scalars['Int'];
  assigneeId?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  issueCategories: Array<Scalars['Int']> | Scalars['Int'];
}>;


export type CreateIssueMutation = { __typename?: 'Mutation', createIssue?: Maybe<{ __typename?: 'Issue', id: number }> };

export type UpdateIssueMutationVariables = Exact<{
  issueId: Scalars['Int'];
  issueStatus: Scalars['Int'];
  assigneeId?: Maybe<Scalars['String']>;
  comment: Scalars['String'];
  dueDate?: Maybe<Scalars['DateTime']>;
}>;


export type UpdateIssueMutation = { __typename?: 'Mutation', updateIssue?: Maybe<{ __typename?: 'Issue', id: number }> };

export type AllIssueCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllIssueCategoriesQuery = { __typename?: 'Query', issueCategories: Array<{ __typename?: 'IssueCategory', id: number, name: string }> };

export type AllIssuesForStatusStatQueryVariables = Exact<{ [key: string]: never; }>;


export type AllIssuesForStatusStatQuery = { __typename?: 'Query', issues: Array<{ __typename?: 'Issue', status: number }> };

export type AllIssuesForFindQueryVariables = Exact<{ [key: string]: never; }>;


export type AllIssuesForFindQuery = { __typename?: 'Query', issues: Array<{ __typename?: 'Issue', id: number, title: string, description: string, dueDate?: Maybe<any>, createdAt: any, updatedAt: any, kind: number, status: number, categories: Array<{ __typename?: 'IssueCategory', id: number, name: string }>, createdBy: { __typename?: 'User', id: string, name: string }, assignee?: Maybe<{ __typename?: 'User', id: string, name: string }> }> };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, name: string }> };

export type CurrentUserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserInfoQuery = { __typename?: 'Query', currentUser?: Maybe<{ __typename?: 'User', id: string, name: string, icon?: Maybe<string>, project: { __typename?: 'Project', id: string, name: string } }> };

export type IssueDetailQueryVariables = Exact<{
  issueId: Scalars['Int'];
}>;


export type IssueDetailQuery = { __typename?: 'Query', issues: Array<{ __typename?: 'Issue', id: number, kind: number, title: string, description: string, status: number, projectId: string, dueDate?: Maybe<any>, createdAt: any, updatedAt: any, assignee?: Maybe<{ __typename?: 'User', id: string, name: string }>, createdBy: { __typename?: 'User', id: string, name: string }, categories: Array<{ __typename?: 'IssueCategory', id: number, name: string }>, changeLogs: Array<{ __typename?: 'ChangeLog', id: number, comment: string, dueDate?: Maybe<any>, createdAt: any, status: number, assignee?: Maybe<{ __typename?: 'User', id: string, name: string }>, project: { __typename?: 'Project', id: string, name: string }, createdBy: { __typename?: 'User', id: string, name: string } }> }> };

export type ProjectChangeLogsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectChangeLogsQuery = { __typename?: 'Query', projectChangeLogs: Array<{ __typename?: 'ChangeLog', id: number, kind: number, comment: string, dueDate?: Maybe<any>, status: number, createdAt: any, issue: { __typename?: 'Issue', id: number, title: string }, assignee?: Maybe<{ __typename?: 'User', id: string, name: string }>, project: { __typename?: 'Project', id: string, name: string }, createdBy: { __typename?: 'User', id: string, name: string } }> };


export const CreateIssueDocument = gql`
    mutation createIssue($title: String!, $description: String!, $issueKind: Int!, $assigneeId: String, $dueDate: DateTime, $issueCategories: [Int!]!) {
  createIssue(
    title: $title
    description: $description
    issueKind: $issueKind
    assigneeId: $assigneeId
    dueDate: $dueDate
    issueCategories: $issueCategories
  ) {
    id
  }
}
    `;

export function useCreateIssueMutation() {
  return Urql.useMutation<CreateIssueMutation, CreateIssueMutationVariables>(CreateIssueDocument);
};
export const UpdateIssueDocument = gql`
    mutation updateIssue($issueId: Int!, $issueStatus: Int!, $assigneeId: String, $comment: String!, $dueDate: DateTime) {
  updateIssue(
    issueId: $issueId
    issueStatus: $issueStatus
    assigneeId: $assigneeId
    comment: $comment
    dueDate: $dueDate
  ) {
    id
  }
}
    `;

export function useUpdateIssueMutation() {
  return Urql.useMutation<UpdateIssueMutation, UpdateIssueMutationVariables>(UpdateIssueDocument);
};
export const AllIssueCategoriesDocument = gql`
    query allIssueCategories {
  issueCategories {
    id
    name
  }
}
    `;

export function useAllIssueCategoriesQuery(options?: Omit<Urql.UseQueryArgs<AllIssueCategoriesQueryVariables>, 'query'>) {
  return Urql.useQuery<AllIssueCategoriesQuery>({ query: AllIssueCategoriesDocument, ...options });
};
export const AllIssuesForStatusStatDocument = gql`
    query allIssuesForStatusStat {
  issues {
    status
  }
}
    `;

export function useAllIssuesForStatusStatQuery(options?: Omit<Urql.UseQueryArgs<AllIssuesForStatusStatQueryVariables>, 'query'>) {
  return Urql.useQuery<AllIssuesForStatusStatQuery>({ query: AllIssuesForStatusStatDocument, ...options });
};
export const AllIssuesForFindDocument = gql`
    query allIssuesForFind {
  issues {
    id
    title
    description
    dueDate
    createdAt
    updatedAt
    categories {
      id
      name
    }
    kind
    status
    createdBy {
      id
      name
    }
    assignee {
      id
      name
    }
  }
}
    `;

export function useAllIssuesForFindQuery(options?: Omit<Urql.UseQueryArgs<AllIssuesForFindQueryVariables>, 'query'>) {
  return Urql.useQuery<AllIssuesForFindQuery>({ query: AllIssuesForFindDocument, ...options });
};
export const AllUsersDocument = gql`
    query allUsers {
  users {
    id
    name
  }
}
    `;

export function useAllUsersQuery(options?: Omit<Urql.UseQueryArgs<AllUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<AllUsersQuery>({ query: AllUsersDocument, ...options });
};
export const CurrentUserInfoDocument = gql`
    query currentUserInfo {
  currentUser {
    id
    name
    icon
    project {
      id
      name
    }
  }
}
    `;

export function useCurrentUserInfoQuery(options?: Omit<Urql.UseQueryArgs<CurrentUserInfoQueryVariables>, 'query'>) {
  return Urql.useQuery<CurrentUserInfoQuery>({ query: CurrentUserInfoDocument, ...options });
};
export const IssueDetailDocument = gql`
    query issueDetail($issueId: Int!) {
  issues(issueIds: [$issueId]) {
    id
    kind
    title
    description
    status
    assignee {
      id
      name
    }
    projectId
    dueDate
    createdAt
    updatedAt
    createdBy {
      id
      name
    }
    categories {
      id
      name
    }
    changeLogs {
      id
      comment
      dueDate
      createdAt
      status
      assignee {
        id
        name
      }
      project {
        id
        name
      }
      createdBy {
        id
        name
      }
    }
  }
}
    `;

export function useIssueDetailQuery(options: Omit<Urql.UseQueryArgs<IssueDetailQueryVariables>, 'query'>) {
  return Urql.useQuery<IssueDetailQuery>({ query: IssueDetailDocument, ...options });
};
export const ProjectChangeLogsDocument = gql`
    query projectChangeLogs {
  projectChangeLogs {
    id
    kind
    issue {
      id
      title
    }
    comment
    dueDate
    assignee {
      id
      name
    }
    project {
      id
      name
    }
    status
    createdAt
    createdBy {
      id
      name
    }
  }
}
    `;

export function useProjectChangeLogsQuery(options?: Omit<Urql.UseQueryArgs<ProjectChangeLogsQueryVariables>, 'query'>) {
  return Urql.useQuery<ProjectChangeLogsQuery>({ query: ProjectChangeLogsDocument, ...options });
};