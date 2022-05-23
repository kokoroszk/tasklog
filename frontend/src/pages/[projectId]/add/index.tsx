import type { NextPage } from 'next';

import { Add } from 'component/template/add';
import { HeadMetaData } from 'component/util/head-meta-data';
import { useAuth } from 'usecase/account/use-auth';

const Home: NextPage = () => {
  useAuth();
  return (
    <>
      <HeadMetaData />
      <Add />
    </>
  );
};

export default Home;
