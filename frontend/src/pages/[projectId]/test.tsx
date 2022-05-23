import type { NextPage } from 'next';
import Head from 'next/head';

import { Add } from 'component/template/add';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>not impelemented.</title>
        <meta name="description" content="My App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Add />
    </>
  );
};

export default Home;
