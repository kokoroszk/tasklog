import { config } from 'config';
import { cacheExchange, createClient, dedupExchange, fetchExchange, ssrExchange } from 'urql';
import customScalarsExchange from 'urql-custom-scalars-exchange';

const isServerSide = typeof window === 'undefined';
const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? (window as any).__URQL_DATA__ : undefined,
});

export const client = createClient({
  url: `${config.backend.baseUrl}graphql`,
  // suspense: true,
  exchanges: [dedupExchange, cacheExchange, fetchExchange, ssr],
  fetchOptions: () => ({
    credentials: 'include',
  }),
});
