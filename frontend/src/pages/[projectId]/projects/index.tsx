import type { NextPage } from 'next';

import { Projects } from 'component/template/projects';
import { HeadMetaData } from 'component/util/head-meta-data';
import { useAuth } from 'usecase/account/use-auth';

const Home: NextPage = () => {
  useAuth();
  return (
    <>
      <HeadMetaData />
      <Projects />
    </>
  );
};

export default Home;
