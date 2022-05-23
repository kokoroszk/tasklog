import type { NextPage } from 'next';

import { View } from 'component/template/view';
import { HeadMetaData } from 'component/util/head-meta-data';
import { useAuth } from 'usecase/account/use-auth';

const Home: NextPage = () => {
  useAuth();
  return (
    <>
      <HeadMetaData />
      <View />
    </>
  );
};

export default Home;
