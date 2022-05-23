import type { NextPage } from 'next';

import { Index } from 'component/template/not-implemented';
import { HeadMetaData } from 'component/util/head-meta-data';
import { useAuth } from 'usecase/account/use-auth';

const Home: NextPage = () => {
  useAuth();
  return (
    <>
      <HeadMetaData />
      <Index />
    </>
  );
};

export default Home;
