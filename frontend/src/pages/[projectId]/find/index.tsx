import type { NextPage } from 'next';

import { Find } from 'component/template/find';
import { isEmpty } from 'ramda';
import { HeadMetaData } from 'component/util/head-meta-data';
import { useAuth } from 'usecase/account/use-auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCurrentUserInfo } from 'client/hooks';

const Home: NextPage = () => {
  useAuth();

  return (
    <>
      <HeadMetaData />
      <Find />
    </>
  );
};

export default Home;
