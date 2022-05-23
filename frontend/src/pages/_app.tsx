import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

import '../styles/globals.css';
import 'ress';

import { NotImplementedSnackbar } from 'utils/notify-not-implemented';
import { Provider } from 'urql';
import { client } from 'client/urql-client';
import { LoadingOverlay } from 'component/util/loading-overlay';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Provider value={client}>
        <Component {...pageProps} />
        <NotImplementedSnackbar />
        <LoadingOverlay />
      </Provider>
    </RecoilRoot>
  );
}
export default MyApp;
