import type { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/signIn');
  });
  return <></>;
};

export default Home;
